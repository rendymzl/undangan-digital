import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  HelpCircle, 
  Book, 
  Video, 
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  Users,
  Lightbulb,
  FileText,
  Play,
  ExternalLink
} from 'lucide-react';
import { useHelp } from './hooks/useHelp';

export const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { 
    faqItems, 
    tutorials, 
    guides, 
    popularArticles,
    isLoading,
    searchFAQ,
    trackArticleView
  } = useHelp();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      searchFAQ(query);
    }
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleArticleClick = (articleId: string, title: string) => {
    trackArticleView(articleId, title);
  };

  const filteredFAQ = faqItems?.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pusat Bantuan"
        description="Temukan jawaban untuk pertanyaan Anda dan pelajari cara menggunakan platform"
      />

      {/* Search Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari bantuan, tutorial, atau FAQ..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
            
            {/* Quick Links */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <Button variant="outline" size="sm" onClick={() => handleSearch('cara membuat undangan')}>
                Cara Membuat Undangan
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSearch('menambah tamu')}>
                Menambah Tamu
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSearch('pembayaran')}>
                Pembayaran
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSearch('RSVP')}>
                RSVP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorial</TabsTrigger>
          <TabsTrigger value="guides">Panduan</TabsTrigger>
          <TabsTrigger value="popular">Populer</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          {/* FAQ Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Pertanyaan yang sering diajukan beserta jawabannya
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  Semua
                </Button>
                <Button
                  variant={selectedCategory === 'getting-started' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('getting-started')}
                >
                  Memulai
                </Button>
                <Button
                  variant={selectedCategory === 'invitations' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('invitations')}
                >
                  Undangan
                </Button>
                <Button
                  variant={selectedCategory === 'guests' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('guests')}
                >
                  Tamu
                </Button>
                <Button
                  variant={selectedCategory === 'payments' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('payments')}
                >
                  Pembayaran
                </Button>
                <Button
                  variant={selectedCategory === 'technical' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('technical')}
                >
                  Teknis
                </Button>
              </div>

              {/* FAQ Items */}
              <div className="space-y-3">
                {filteredFAQ.length > 0 ? (
                  filteredFAQ.map((item) => (
                    <div key={item.id} className="border rounded-lg">
                      <button
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                        onClick={() => toggleFAQ(item.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <span className="font-medium">{item.question}</span>
                        </div>
                        {expandedFAQ === item.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {expandedFAQ === item.id && (
                        <div className="px-4 pb-4 pt-2 border-t bg-muted/20">
                          <div className="prose prose-sm max-w-none">
                            <p className="text-muted-foreground">{item.answer}</p>
                            {item.relatedLinks && item.relatedLinks.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium mb-2">Link Terkait:</p>
                                <ul className="space-y-1">
                                  {item.relatedLinks.map((link, index) => (
                                    <li key={index}>
                                      <a 
                                        href={link.url} 
                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                        onClick={() => handleArticleClick(link.url, link.title)}
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        {link.title}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                            <span className="text-sm text-muted-foreground">Apakah ini membantu?</span>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                👍 Ya
                              </Button>
                              <Button variant="outline" size="sm">
                                👎 Tidak
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Tidak ada FAQ yang cocok dengan pencarian Anda' : 'Tidak ada FAQ tersedia'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          {/* Video Tutorials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Tutorial Video
              </CardTitle>
              <CardDescription>
                Pelajari cara menggunakan platform melalui video tutorial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tutorials?.map((tutorial) => (
                  <Card key={tutorial.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <Badge className="absolute top-2 right-2">
                        {tutorial.duration}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{tutorial.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {tutorial.views} views
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {tutorial.rating}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          {/* Step-by-step Guides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Panduan Langkah demi Langkah
              </CardTitle>
              <CardDescription>
                Panduan detail untuk menyelesaikan tugas-tugas tertentu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {guides?.map((guide) => (
                  <Card key={guide.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{guide.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {guide.estimatedTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Lightbulb className="h-3 w-3" />
                              {guide.difficulty}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {guide.category}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Artikel Populer
              </CardTitle>
              <CardDescription>
                Artikel bantuan yang paling sering dibaca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularArticles?.map((article, index) => (
                  <div key={article.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{article.title}</h4>
                      <p className="text-sm text-muted-foreground">{article.summary}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {article.views}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3" />
                        {article.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Masih Butuh Bantuan?
          </CardTitle>
          <CardDescription>
            Hubungi tim support kami jika Anda tidak menemukan jawaban yang dicari
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Live Chat</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Chat langsung dengan tim support
                </p>
                <Button size="sm" className="w-full">
                  Mulai Chat
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => window.location.href = '/dashboard/support-tickets'}
            >
              <CardContent className="p-4 text-center">
                <HelpCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Kirim Tiket</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Buat tiket support untuk masalah kompleks
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Buat Tiket
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Book className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Dokumentasi</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Dokumentasi lengkap untuk developer
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Lihat Docs
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};