import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';

export default function PaymentPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert('Payment successful via ' + paymentMethod.toUpperCase());
      setLoading(false);
      navigate('/');
    }, 2000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900 text-white p-8 flex justify-center items-start">
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-md w-full max-w-md shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Choose Payment Method</h2>

          <div className="mb-6">
            <label className="inline-flex items-center mr-6 cursor-pointer">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="form-radio"
              />
              <span className="ml-2">Credit/Debit Card</span>
            </label>

            <label className="inline-flex items-center mr-6 cursor-pointer">
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                className="form-radio"
              />
              <span className="ml-2">UPI</span>
            </label>

            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                value="netbanking"
                checked={paymentMethod === 'netbanking'}
                onChange={() => setPaymentMethod('netbanking')}
                className="form-radio"
              />
              <span className="ml-2">Net Banking</span>
            </label>
          </div>

          {paymentMethod === 'card' && (
            <>
              <label className="block mb-2">Card Number</label>
              <input className="w-full p-2 mb-4 rounded bg-gray-700" placeholder="1234 5678 9012 3456" required />

              <label className="block mb-2">Expiry Date</label>
              <input className="w-full p-2 mb-4 rounded bg-gray-700" placeholder="MM/YY" required />

              <label className="block mb-2">CVC</label>
              <input className="w-full p-2 mb-6 rounded bg-gray-700" placeholder="123" required />
            </>
          )}

          {paymentMethod === 'upi' && (
            <>
              <label className="block mb-2">Enter your UPI ID</label>
              <input className="w-full p-2 mb-6 rounded bg-gray-700" placeholder="example@bank" required />
            </>
          )}

          {paymentMethod === 'netbanking' && (
            <>
              <label className="block mb-2">Select Bank</label>
              <select className="w-full p-2 mb-6 rounded bg-gray-700" required>
                <option value="">--Select Bank--</option>
                <option value="bank1">Bank 1</option>
                <option value="bank2">Bank 2</option>
                <option value="bank3">Bank 3</option>
              </select>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded font-extrabold text-white ${
              loading ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
            } transition`}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
          <div className="mt-6 flex justify-center items-center space-x-6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
              alt="Visa"
              className="h-8"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
              alt="Mastercard"
              className="h-8"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="h-8"
            />
          </div>
        </form>
      </main>
    </>
  );
}
