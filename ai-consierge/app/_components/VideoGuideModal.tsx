import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Play, X, Clock, CheckCircle, Book, MessageSquare, BarChart3, CreditCard } from 'lucide-react';

interface VideoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoGuideModal({ isOpen, onClose }: VideoGuideModalProps) {
  if (!isOpen) return null;

  const chapters = [
    { icon: Book, title: 'Getting Started', time: '0:00', duration: '2 min' },
    { icon: MessageSquare, title: 'Setting Up Campaigns', time: '2:15', duration: '3 min' },
    { icon: BarChart3, title: 'Reading Analytics', time: '5:30', duration: '2 min' },
    { icon: MessageSquare, title: 'Managing Chats & Escalations', time: '7:45', duration: '3 min' },
    { icon: CreditCard, title: 'Billing & Subscriptions', time: '10:50', duration: '2 min' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-[#004E7C] to-[#0067A3] text-white">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-white mb-2">
                AI Concierge Platform Guide
              </CardTitle>
              <p className="text-[#A0D6D3]">
                Learn how to maximize your revenue with our AI concierge in 12 minutes
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Video Player Area */}
          <div className="relative bg-black aspect-video">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#004E7C]/90 to-[#0067A3]/90">
              <div className="text-center">
                <div className="mx-auto w-24 h-24 bg-[#F5B700] rounded-full flex items-center justify-center shadow-2xl mb-6 hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-12 h-12 text-[#004E7C] ml-1" />
                </div>
                <h3 className="text-2xl text-white mb-2">Welcome to AI Concierge</h3>
                <p className="text-[#A0D6D3] mb-4">Click play to start the tour</p>
                <Badge className="bg-[#F5B700] text-[#004E7C] border-0">
                  <Clock className="w-3 h-3 mr-1" />
                  12 minutes
                </Badge>
              </div>
            </div>
            
            {/* Placeholder for actual video */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <Button size="sm" className="bg-[#F5B700] text-[#004E7C] hover:bg-[#FFC933]">
                    <Play className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 bg-white/20 h-1 rounded-full">
                    <div className="bg-[#F5B700] h-1 rounded-full w-0"></div>
                  </div>
                  <span className="text-white text-sm">0:00 / 12:15</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter List */}
          <div className="p-6 bg-[#FAFAFA]">
            <h4 className="text-lg text-[#004E7C] mb-4">What You'll Learn</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {chapters.map((chapter, index) => {
                const Icon = chapter.icon;
                return (
                  <button
                    key={index}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#004E7C] hover:shadow-md transition-all text-left group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#004E7C] to-[#0067A3] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm text-[#004E7C] mb-1">{chapter.title}</h5>
                      <p className="text-xs text-gray-500">{chapter.time} • {chapter.duration}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-gray-300 group-hover:text-[#A0D6D3]" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="p-6 bg-gradient-to-r from-[#004E7C]/5 to-[#A0D6D3]/10 border-t">
            <h4 className="text-lg text-[#004E7C] mb-3">Key Takeaways</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#A0D6D3] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#004E7C] mb-1">Set up your first campaign</p>
                  <p className="text-xs text-gray-600">Start generating upsell revenue within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#A0D6D3] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#004E7C] mb-1">Track performance metrics</p>
                  <p className="text-xs text-gray-600">Monitor ROI and optimize conversions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#A0D6D3] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#004E7C] mb-1">Master escalations</p>
                  <p className="text-xs text-gray-600">Handle complex requests with human backup</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t flex gap-3">
            <Button 
              className="flex-1 h-12 bg-gradient-to-r from-[#004E7C] to-[#0067A3] hover:from-[#003D5F] hover:to-[#004E7C] text-white"
              onClick={onClose}
            >
              Start Using Platform
            </Button>
            <Button 
              variant="outline"
              className="h-12 border-[#004E7C] text-[#004E7C]"
            >
              Download Guide PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
