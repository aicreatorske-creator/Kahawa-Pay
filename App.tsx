
import React from 'react';
import { KahawaTippingWidget } from './components/KahawaTippingWidget';
import type { Creator } from './types';

// Mock data for a creator. In a real application, this would be fetched from a database.
// This page acts as an example of a dynamic creator page, like `/pages/[username].js` in Next.js.
const mockCreator: Creator = {
  id: 'creator_123',
  name: 'Asha Creative',
  bio: 'Digital artist & storyteller sharing tales from Nairobi. Your support helps me create more art!',
  profileImageUrl: 'https://picsum.photos/seed/asha_creative/128/128',
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark flex flex-col items-center justify-center p-4 font-sans">
      <main className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <img
            src={mockCreator.profileImageUrl}
            alt={mockCreator.name}
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
          />
          <h1 className="text-3xl font-bold">{mockCreator.name}</h1>
          <p className="text-md text-brand-dark/80 mt-2">{mockCreator.bio}</p>
        </div>
        
        <KahawaTippingWidget creatorId={mockCreator.id} />
        
        <div className="mt-8 p-4 bg-white/50 rounded-lg shadow-inner text-sm text-gray-700">
          <h3 className="font-bold text-brand-dark mb-2">How to use this widget on your site:</h3>
          <p>The `KahawaTippingWidget` is a reusable React component. To embed it on your own website, you would import it and render it with your unique creator ID.</p>
          <pre className="bg-gray-800 text-white p-2 rounded-md mt-2 text-xs overflow-x-auto">
            <code>
              {`import { KahawaTippingWidget } from 'kahawa-widget';\n\n<KahawaTippingWidget creatorId="your_creator_id" />`}
            </code>
          </pre>
        </div>
      </main>
    </div>
  );
};

export default App;
