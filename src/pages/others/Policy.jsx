import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 transition-colors duration-300">

        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Privacy Policy
        </h1>

        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Effective Date: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-6 text-gray-700 dark:text-gray-300">

          {[
            {
              title: "1. Information We Collect",
              text: "We collect basic user data such as name, email, and expense records you input into the system.",
            },
            {
              title: "2. How We Use Data",
              text: "Data is used to provide, improve, and secure the platform.",
            },
            {
              title: "3. Data Protection",
              text: "We implement security measures, but no system is completely secure.",
            },
            {
              title: "4. Data Sharing",
              text: "We do not sell your data. Data is shared only when required by law.",
            },
            {
              title: "5. Cookies",
              text: "We may use cookies for session management and performance.",
            },
            {
              title: "6. User Rights",
              text: "You can access, update, or delete your data anytime.",
            },
            {
              title: "7. Third-Party Services",
              text: "Integrated services may follow their own privacy policies.",
            },
            {
              title: "8. Changes to Policy",
              text: "Policy may be updated periodically.",
            },
            {
              title: "9. Contact",
              text: "Email: support@accusoft.com",
            },
          ].map((item, index) => (
            <div key={index}>
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                {item.title}
              </h2>
              <p>{item.text}</p>
            </div>
          ))}

        </section>
      </div>
    </div>
  );
};

export default Privacy;