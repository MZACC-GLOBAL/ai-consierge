"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Textarea } from './TextArea';
import { Avatar, AvatarFallback } from './Avatar';
import { 
  User, MapPin, MessageSquare, Calendar, Star, Crown, 
  Euro, Languages, Edit, Save, X 
} from 'lucide-react';

interface GuestData {
  name: string;
  room: string;
  language: string;
  languageFlag: string;
  checkIn: string;
  checkOut: string;
  lastRequest: string;
  satisfactionScore: number;
  totalSpent: number;
  isVIP: boolean;
  upsellHistory: {
    item: string;
    amount: number;
    date: string;
  }[];
  notes: string;
}

interface GuestCRMCardProps {
  guest: GuestData;
  onUpdate?: (guest: GuestData) => void;
}

export function GuestCRMCard({ guest, onUpdate }: GuestCRMCardProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(guest.notes);
  const [isVIP, setIsVIP] = useState(guest.isVIP);

  const handleSaveNotes = () => {
    if (onUpdate) {
      onUpdate({ ...guest, notes });
    }
    setIsEditingNotes(false);
  };

  const toggleVIP = () => {
    const newVIPStatus = !isVIP;
    setIsVIP(newVIPStatus);
    if (onUpdate) {
      onUpdate({ ...guest, isVIP: newVIPStatus });
    }
  };

  const initials = guest.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="border-0 shadow-lg h-full overflow-auto">
      <CardHeader className="bg-gradient-to-r from-[#004E7C] to-[#0067A3] text-white">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-white">Guest Profile</CardTitle>
          <Button
            size="sm"
            onClick={toggleVIP}
            className={`${
              isVIP 
                ? 'bg-[#F5B700] text-[#004E7C] hover:bg-[#FFC933]' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Crown className="w-4 h-4 mr-1" />
            {isVIP ? 'VIP' : 'Mark VIP'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Guest Info */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-[#F5B700]">
            <AvatarFallback className="bg-gradient-to-br from-[#004E7C] to-[#0067A3] text-white text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg text-[#004E7C] mb-1">{guest.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Room {guest.room}</span>
            </div>
          </div>
        </div>

        {/* Language & Satisfaction */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[#A0D6D3]/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Languages className="w-4 h-4 text-[#004E7C]" />
              <span className="text-xs text-gray-600">Language</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{guest.languageFlag}</span>
              <span className="text-sm text-[#004E7C]">{guest.language}</span>
            </div>
          </div>

          <div className="p-3 bg-[#F5B700]/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-[#F5B700]" />
              <span className="text-xs text-gray-600">Satisfaction</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < guest.satisfactionScore 
                      ? 'fill-[#F5B700] text-[#F5B700]' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stay Dates */}
        <div className="p-4 bg-white border border-[#A0D6D3]/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#004E7C]" />
            <span className="text-sm text-gray-600">Stay Duration</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Check-in</p>
              <p className="text-sm text-[#004E7C]">{guest.checkIn}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Check-out</p>
              <p className="text-sm text-[#004E7C]">{guest.checkOut}</p>
            </div>
          </div>
        </div>

        {/* Last Request */}
        <div className="p-4 bg-[#004E7C]/5 rounded-lg border-l-4 border-[#004E7C]">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-[#004E7C]" />
            <span className="text-sm text-gray-600">Last Request</span>
          </div>
          <p className="text-sm text-[#004E7C]">{guest.lastRequest}</p>
        </div>

        {/* Upsell History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Euro className="w-4 h-4 text-[#F5B700]" />
              <h4 className="text-sm text-gray-600">Upsell History</h4>
            </div>
            <Badge className="bg-[#F5B700] text-[#004E7C]">
              €{guest.totalSpent}
            </Badge>
          </div>
          <div className="space-y-2">
            {guest.upsellHistory.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm text-[#004E7C]">{item.item}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <span className="text-sm text-[#F5B700]">€{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm text-gray-600">Guest Notes</h4>
            {!isEditingNotes ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingNotes(true)}
                className="border-[#004E7C] text-[#004E7C]"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                  className="bg-[#004E7C] text-white hover:bg-[#003D5F]"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setNotes(guest.notes);
                    setIsEditingNotes(false);
                  }}
                  className="border-gray-300"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
          {isEditingNotes ? (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this guest..."
              className="min-h-[100px] border-[#A0D6D3] focus:ring-[#004E7C]"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px]">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {notes || 'No notes added yet...'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
