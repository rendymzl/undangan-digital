import { useState, useEffect } from 'react';
import useApi from '@/hooks/shared/useApi';
import type { FAQItem, Tutorial, Guide, PopularArticle } from '../types/support';
import { supportApi } from '../services/supportApi';

export const useHelp = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [popularArticles, setPopularArticles] = useState<PopularArticle[]>([]);
  const [searchResults, setSearchResults] = useState<FAQItem[]>([]);
  
  const faqApi = useApi<FAQItem[]>();
  const tutorialsApi = useApi<Tutorial[]>();
  const guidesApi = useApi<Guide[]>();
  const popularApi = useApi<PopularArticle[]>();
  const searchApi = useApi<FAQItem[]>();

  useEffect(() => {
    loadHelpData();
  }, []);

  const loadHelpData = async () => {
    try {
      // Load FAQ items
      const faqs = await faqApi.execute(() => supportApi.getFAQItems());
      setFaqItems(faqs);

      // Load tutorials
      const tutorialData = await tutorialsApi.execute(() => supportApi.getTutorials());
      setTutorials(tutorialData);

      // Load guides
      const guideData = await guidesApi.execute(() => supportApi.getGuides());
      setGuides(guideData);

      // Load popular articles
      const popularData = await popularApi.execute(() => supportApi.getPopularArticles());
      setPopularArticles(popularData);
    } catch (error) {
      console.error('Error loading help data:', error);
    }
  };

  const searchFAQ = async (query: string) => {
    try {
      const results = await searchApi.execute(() => supportApi.searchFAQ(query));
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching FAQ:', error);
    }
  };

  const trackArticleView = async (articleId: string, title: string) => {
    try {
      await supportApi.trackArticleView(articleId, title);
    } catch (error) {
      console.error('Error tracking article view:', error);
    }
  };

  const submitFeedback = async (articleId: string, helpful: boolean, comment?: string) => {
    try {
      await supportApi.submitFeedback(articleId, helpful, comment);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  };

  return {
    faqItems,
    tutorials,
    guides,
    popularArticles,
    searchResults,
    isLoading: faqApi.loading || tutorialsApi.loading || guidesApi.loading || popularApi.loading,
    error: faqApi.error || tutorialsApi.error || guidesApi.error || popularApi.error,
    searchFAQ,
    trackArticleView,
    submitFeedback,
    refreshHelpData: loadHelpData,
  };
};