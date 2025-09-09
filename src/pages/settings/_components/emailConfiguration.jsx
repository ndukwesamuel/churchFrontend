import { useState } from "react";
import { Mail } from "lucide-react";

const EmailConfigContent = () => {
  const [enableEmail, setEnableEmail] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
          <Mail className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Email Configuration</h3>
          <p className="text-sm text-gray-500">
            Configure the email services settings
          </p>
        </div>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Provider
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Provider</option>
            <option>SendGrid</option>
            <option>Mailgun</option>
            <option>AWS SES</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="noreply@yourchurch.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium text-gray-700">
            Enable email messaging
          </span>
          <button
            type="button"
            onClick={() => setEnableEmail(!enableEmail)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enableEmail ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enableEmail ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700">Email Balance</div>
          <div className="text-lg font-semibold text-purple-700">Unlimited</div>
        </div>

        <div className="flex justify-start">
          <button
            type="button"
            className="bg-[#5B38DB] text-white px-6 py-2 rounded-full hover:bg-[#4A2FB8] transition-colors"
          >
            Save Email Settings
          </button>
        </div>
      </form>
    </div>
  );
};
export default EmailConfigContent;
