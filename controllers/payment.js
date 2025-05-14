const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Analysis = require('../models/Analysis');

// Создание платежа
exports.createPayment = async (req, res) => {
  const { analysisId } = req.body;

  try {
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });

    // Создание платежа через Stripe (Tochka использует Stripe-совместимый API)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 49900, // 499 руб
      currency: 'rub',
      metadata: { analysisId: analysis._id }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: 'Payment failed' });
  }
};

// Подтверждение оплаты
exports.confirmPayment = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const analysisId = paymentIntent.metadata.analysisId;
      await Analysis.findByIdAndUpdate(analysisId, { paid: true });
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Payment confirmation failed' });
  }
};
