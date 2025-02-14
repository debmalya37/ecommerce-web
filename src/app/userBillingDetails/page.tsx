"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"; 



const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function UserBillingDetailsPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();
  const { data: session } = useSession(); // Get session data
  
  // Function to fetch user data based on session email
  const fetchUserData = async (userEmail: string) => {
    // Replace with actual method to fetch user data from the database
    const response = await fetch(`/api/user?email=${userEmail}`);
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const userEmail =  session?.user?.email || "";// Get session email
    if (!userEmail) {
      // Redirect to login page if no session user is found
      router.push('/login');
      return;
    }

    // Fetch user details from the database using the session email
    const loadUserData = async () => {
      const user = await fetchUserData(userEmail);
      if (user) {
        // Populate form with fetched user details
        setFullName(user.fullName);
        setEmail(user.email);
        setPhone(user.phone);
        setAddress(user.address);
        setPincode(user.pincode);
        setState(user.state);
      }
    };

    loadUserData();
  }, [router]);

  const handleSubmit = () => {
    if (!fullName || !email || !phone || !address || !pincode || !state) {
      alert('Please fill in all fields');
      return;
    }

    // Retrieve product details from sessionStorage
    const selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct') || '{}');

    // Save billing and product details to sessionStorage
    sessionStorage.setItem('userDetails', JSON.stringify({
      fullName,
      email,
      phone,
      address,
      pincode,
      state,
      country: 'India',
      product: selectedProduct,
    }));

    // Redirect to payment page
    router.push('/payment');
  };

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-lg h-[100vh]">
      <h2 className="text-2xl font-semibold text-gray-800">Billing Details</h2>
      <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="fullName" className="block text-lg text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-lg text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john.doe@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-lg text-gray-700">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="9999999999"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-lg text-gray-700">Address</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Street, City, Landmark"
          />
        </div>

        <div>
          <label htmlFor="pincode" className="block text-lg text-gray-700">Pincode</label>
          <input
            type="text"
            id="pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123456"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-lg text-gray-700">State</label>
          <select
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select State</option>
            {states.map((stateName, index) => (
              <option key={index} value={stateName}>{stateName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg text-gray-700">Country</label>
          <input
            title='country'
            type="text"
            value="India"
            disabled
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-green-600 text-white py-2 px-4 w-full rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
