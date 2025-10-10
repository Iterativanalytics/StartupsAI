import { useState, useEffect } from 'react';
import { EmpathyMapData } from '@/components/design-thinking/empathize/EmpathyMapBuilder';

export function useEmpathyMaps(projectId: string) {
  const [empathyMaps, setEmpathyMaps] = useState<EmpathyMapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmpathyMaps = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/dt/projects/${projectId}/empathy-maps`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setEmpathyMaps(data);
      } catch (err) {
        console.error('Error fetching empathy maps:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchEmpathyMaps();
    }
  }, [projectId]);

  const createEmpathyMap = async (data: Omit<EmpathyMapData, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/dt/projects/${projectId}/empathy-maps`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newEmpathyMap = await response.json();
      setEmpathyMaps(prev => [...prev, newEmpathyMap]);
      return newEmpathyMap;
    } catch (err) {
      console.error('Error creating empathy map:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const updateEmpathyMap = async (id: string, updates: Partial<EmpathyMapData>) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/dt/empathy-maps/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedEmpathyMap = await response.json();
      setEmpathyMaps(prev => prev.map(map => map.id === id ? updatedEmpathyMap : map));
      return updatedEmpathyMap;
    } catch (err) {
      console.error('Error updating empathy map:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deleteEmpathyMap = async (id: string) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/dt/empathy-maps/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setEmpathyMaps(prev => prev.filter(map => map.id !== id));
    } catch (err) {
      console.error('Error deleting empathy map:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const getEmpathyMapById = (id: string) => {
    return empathyMaps.find(map => map.id === id);
  };

  const getTotalItems = (empathyMap: EmpathyMapData) => {
    return Object.values(empathyMap).reduce((total, items) => {
      return total + (Array.isArray(items) ? items.length : 0);
    }, 0);
  };

  const getAnalytics = () => {
    if (empathyMaps.length === 0) {
      return {
        totalMaps: 0,
        averageItems: 0,
        mostCompleteMap: null,
        leastCompleteMap: null
      };
    }

    const analytics = empathyMaps.map(map => ({
      id: map.id,
      userPersona: map.userPersona,
      totalItems: getTotalItems(map),
      completeness: getTotalItems(map) / 30 * 100 // Assuming 30 is max items
    }));

    const sortedByCompleteness = analytics.sort((a, b) => b.totalItems - a.totalItems);

    return {
      totalMaps: empathyMaps.length,
      averageItems: Math.round(analytics.reduce((sum, map) => sum + map.totalItems, 0) / analytics.length),
      mostCompleteMap: sortedByCompleteness[0],
      leastCompleteMap: sortedByCompleteness[sortedByCompleteness.length - 1]
    };
  };

  return {
    empathyMaps,
    loading,
    error,
    createEmpathyMap,
    updateEmpathyMap,
    deleteEmpathyMap,
    getEmpathyMapById,
    getAnalytics,
    refetch: () => {
      if (projectId) {
        setLoading(true);
        // Trigger useEffect to refetch
        setEmpathyMaps([]);
      }
    }
  };
}
