import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useSupabase() {
  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: linksData, error: linksError } = await supabase
          .from('links')
          .select('*')
          .order('sort_order', { ascending: true });

        if (linksError) {
          console.error("Error database links:", linksError);
        } else {
          setLinks(linksData || []);
        }
      } catch (err) {
        console.error("Error fetching links:", err);
      } finally {
        setLoadingLinks(false);
      }

      try {
        const { data: popups, error: popupError } = await supabase
          .from('popups')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (popupError) {
          console.error("Error database popups:", popupError);
        } else if (popups && popups.length > 0) {
          setPopup(popups[0]);
        }
      } catch (err) {
        console.error("Error fetching popup:", err);
      }
    }
    loadData();
  }, []);

  return { links, loadingLinks, popup };
}
