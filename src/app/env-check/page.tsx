/**
 * Public Environment Check Page
 * Verify Vercel environment variables without authentication
 */

export default function EnvCheckPage() {
  const envVars = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    MOCK_AUTH: process.env.NEXT_PUBLIC_MOCK_AUTH,
    MOCK_OPENINGS: process.env.NEXT_PUBLIC_MOCK_OPENINGS,
    MOCK_PRICING: process.env.NEXT_PUBLIC_MOCK_PRICING,
    MOCK_PRODUCTS: process.env.NEXT_PUBLIC_MOCK_PRODUCTS,
    MOCK_SUPPLIERS: process.env.NEXT_PUBLIC_MOCK_SUPPLIERS,
    MOCK_CATEGORIES: process.env.NEXT_PUBLIC_MOCK_CATEGORIES,
    MOCK_QUOTES: process.env.NEXT_PUBLIC_MOCK_QUOTES,
    CATALOG_SOURCE: process.env.NEXT_PUBLIC_CATALOG_SOURCE,
    CART_SOURCE: process.env.NEXT_PUBLIC_CART_SOURCE,
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Check</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
        
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Variable</th>
              <th className="text-left py-2">Value</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(envVars).map(([key, value]) => {
              const isCorrect = 
                (key.includes('MOCK') && value === 'false') ||
                (key === 'API_URL' && value?.includes('render.com')) ||
                (key.includes('SOURCE') && value === 'mercur');
              
              return (
                <tr key={key} className="border-b">
                  <td className="py-2 font-mono text-sm">{key}</td>
                  <td className="py-2 font-mono text-sm">{value || '(not set)'}</td>
                  <td className="py-2">
                    {isCorrect ? (
                      <span className="text-green-600">✅ Correct</span>
                    ) : (
                      <span className="text-red-600">❌ Should be updated</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Expected for Real API:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>API_URL: should contain "render.com"</li>
            <li>All MOCK_* variables: should be "false"</li>
            <li>CATALOG_SOURCE & CART_SOURCE: should be "mercur"</li>
          </ul>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Built at: {new Date().toISOString()}</p>
          <p>If values are incorrect, update in Vercel and redeploy.</p>
        </div>
      </div>
    </div>
  );
}
