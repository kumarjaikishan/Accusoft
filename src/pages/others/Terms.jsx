import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 transition-colors duration-300">

        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Terms & Conditions
        </h1>

        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Effective Date: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-6 text-gray-700 dark:text-gray-300">

          {[
            {
              title: "1. Use of Service",
              text: "AccuSoft is a free expense management system designed for personal and business use. You agree to use it responsibly and lawfully.",
            },
            {
              title: "2. User Responsibility",
              text: "You are responsible for maintaining account security and ensuring the accuracy of your financial data.",
            },
            {
              title: "3. Free Service",
              text: "AccuSoft is currently free. We may introduce paid features or modify services anytime.",
            },
            {
              title: "4. Data Usage",
              text: "Your data is used only to provide and improve the service. We do not sell your data.",
            },
            {
              title: "5. Account Suspension",
              text: "Accounts may be suspended for misuse, fraud, or violation of policies.",
            },
            {
              title: "6. Limitation of Liability",
              text: 'AccuSoft is provided "as is". We are not responsible for data loss or financial decisions made using the platform.',
            },
            {
              title: "7. Changes to Terms",
              text: "Terms may be updated anytime. Continued use means acceptance of updated terms.",
            },
            {
              title: "8. Contact",
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

export default Terms;