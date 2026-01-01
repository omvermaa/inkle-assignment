import { useEffect, useState } from 'react';
import { api } from './api';
import { TaxTable } from './components/TaxTable';
import { EditModal } from './components/EditModal';
import { Loader2 } from 'lucide-react';

function App() {
  const [taxes, setTaxes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);

  // Helper to format API date (ISO string) to "Jan 20, 2025"
  const formatDate = (dateString) => {
    if (!dateString) return 'Jan 20, 2025'; // Fallback
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taxesRes, countriesRes] = await Promise.all([
          api.getTaxes(),
          api.getCountries()
        ]);

        // INTELLIGENT MAPPING:
        // Use real API fields if they exist.
        // If not, fall back to the random mock data.
        const processedTaxes = taxesRes.map(tax => ({
          ...tax,
          // Check for 'gender', otherwise mock it
          gender: tax.gender || (Math.random() > 0.5 ? 'Male' : 'Female'),
          
          // Check for 'requestDate' OR 'createdAt' (common in mockapi), otherwise mock it
          requestDate: formatDate(tax.requestDate || tax.createdAt)
        }));

        setTaxes(processedTaxes);
        setCountries(countriesRes);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (tax) => {
    setSelectedTax(tax);
    setIsModalOpen(true);
  };

  const handleSave = async (id, updatedFields) => {
    try {
      setTaxes(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
      setIsModalOpen(false);
      await api.updateTax(id, updatedFields);
    } catch (error) {
      console.error("Failed to update", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#2c2c2c] p-8 font-sans flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-gray-400 mb-4 text-sm font-medium">Frame 2018776271</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : (
          <TaxTable data={taxes} onEdit={handleEdit} />
        )}

        <EditModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          data={selectedTax}
          countries={countries}
        />
      </div>
    </div>
  );
}

export default App;