import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle,CardDescription } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Textarea } from './TextArea';
import { Label } from './Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { Progress } from './ProgressBar';
import { 
  AlertCircle, Clock, Send, Bell, Mail, MessageCircle, 
  Phone, X, CheckCircle, TrendingUp 
} from 'lucide-react';
import { toast } from 'sonner';

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
  roomNumber: string;
  issue: string;
  escalateUser:()=>void;
  isEscalation:boolean
}

export function EscalationModal({escalateUser,isEscalation, isOpen, onClose, guestName, roomNumber, issue }: EscalationModalProps) {
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [notificationMethod, setNotificationMethod] = useState<'email' | 'sms' | 'whatsapp' | 'all'>('all');
  const [notes, setNotes] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds
  // const [isEscalated, setIsEscalated] = useState(isEscalation);

  const slaTimeouts = {
    low: 60, // 60 minutes
    medium: 30, // 30 minutes
    high: 15, // 15 minutes
    urgent: 5, // 5 minutes
  };

  useEffect(() => {
    if (isEscalation) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isEscalation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEscalate = () => {
    
    
    // api req should be here
    escalateUser()
    //

    // setIsEscalated(true);
    
    setTimeRemaining(slaTimeouts[priority] * 60);
    
    toast.success('Request Escalated', {
      description: `Staff notified via ${notificationMethod}. Expected response in ${slaTimeouts[priority]} minutes.`,
      icon: <CheckCircle className="w-5 h-5" />,
    });

    // Simulate staff notification
    setTimeout(() => {
      toast.info('Staff Response Received', {
        description: 'A team member is now handling the request.',
        icon: <Bell className="w-5 h-5" />,
      });
    }, 3000);
  };

  if (!isOpen) return null;

  const progressPercentage = (timeRemaining / (slaTimeouts[priority] * 60)) * 100;
  // useEffect(()=>{
  //   if (isEscalation) {
  //     //setIsEscalated(true);
  //     setTimeRemaining(slaTimeouts[priority] * 60);
  //     toast.success('Request Escalated', {
  //       description: `Staff notified via ${notificationMethod}. Expected response in ${slaTimeouts[priority]} minutes.`,
  //       icon: <CheckCircle className="w-5 h-5" />,
  //     });
  //     // Simulate staff notification
  //     setTimeout(() => {
  //       toast.info('Staff Response Received', {
  //         description: 'A team member is now handling the request.',
  //         icon: <Bell className="w-5 h-5" />,
  //       });
  //     }, 3000);
  //   }
  // },[])


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl border-0 bg-white shadow-2xl max-h-[90vh] overflow-auto">
        <CardHeader className={`pb-4 ${
           isEscalation
            ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' 
            : 'bg-gradient-to-r from-[#004E7C] to-[#0067A3] text-white'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                 isEscalation? 'bg-white/20' : 'bg-[#F5B700]'
              }`}>
                <AlertCircle className={`w-6 h-6 ${
                  isEscalation? 'text-white' : 'text-[#004E7C]'
                }`} />
              </div>
              <div>
                <CardTitle className="text-white text-xl">
                  {isEscalation ? 'Escalated to Staff' : 'Escalate to Human Staff'}
                </CardTitle>
                <CardDescription className={`${
                  isEscalation ? 'text-white/80' : 'text-[#A0D6D3]'
                }`}>
                  {guestName} • Room {roomNumber}
                </CardDescription>
              </div>
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

        <CardContent className="p-6 space-y-6">
          {/* SLA Timer (shown when escalated) */}
          {isEscalation && (
            <Card className="border-2 border-orange-500 bg-orange-50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <h4 className="text-orange-900">SLA Timer Active</h4>
                  </div>
                  <Badge className={`${
                    timeRemaining < 300 
                      ? 'bg-red-600' 
                      : timeRemaining < 600 
                      ? 'bg-orange-500' 
                      : 'bg-green-600'
                  } text-white border-0`}>
                    {formatTime(timeRemaining)}
                  </Badge>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-3"
                  indicatorClassName={
                    progressPercentage < 33 
                      ? "bg-red-500" 
                      : progressPercentage < 66 
                      ? "bg-orange-500" 
                      : "bg-green-500"
                  }
                />
                <p className="text-sm text-orange-700 mt-2">
                  Expected response in {slaTimeouts[priority]} minutes • {notificationMethod.toUpperCase()} notification sent
                </p>
              </CardContent>
            </Card>
          )}

          {/* Guest Issue */}
          <div className="p-4 bg-[#004E7C]/5 rounded-lg border-l-4 border-[#004E7C]">
            <h4 className="text-sm text-gray-600 mb-2">Guest Request</h4>
            <p className="text-[#004E7C]">{issue}</p>
          </div>

          {!isEscalation && (
            <>
              {/* Priority Level */}
              <div className="space-y-2  ">
                <Label htmlFor="priority" className="text-[#004E7C]">Priority Level</Label>
                <Select   value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger className="h-12 border-[#A0D6D3]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        Low Priority (60 min SLA)
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        Medium Priority (30 min SLA)
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        High Priority (15 min SLA)
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Urgent (5 min SLA)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notification Method */}
              <div className="space-y-2">
                <Label htmlFor="notification" className="text-[#004E7C]">Notify Staff Via</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={notificationMethod === 'email' ? 'default' : 'outline'}
                    className={notificationMethod === 'email' 
                      ? 'bg-[#004E7C] text-white' 
                      : 'border-[#A0D6D3] text-[#004E7C]'
                    }
                    onClick={() => setNotificationMethod('email')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant={notificationMethod === 'sms' ? 'default' : 'outline'}
                    className={notificationMethod === 'sms' 
                      ? 'bg-[#004E7C] text-white' 
                      : 'border-[#A0D6D3] text-[#004E7C]'
                    }
                    onClick={() => setNotificationMethod('sms')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    SMS
                  </Button>
                  <Button
                    variant={notificationMethod === 'whatsapp' ? 'default' : 'outline'}
                    className={notificationMethod === 'whatsapp' 
                      ? 'bg-[#004E7C] text-white' 
                      : 'border-[#A0D6D3] text-[#004E7C]'
                    }
                    onClick={() => setNotificationMethod('whatsapp')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant={notificationMethod === 'all' ? 'default' : 'outline'}
                    className={notificationMethod === 'all' 
                      ? 'bg-[#F5B700] text-[#004E7C]' 
                      : 'border-[#A0D6D3] text-[#004E7C]'
                    }
                    onClick={() => setNotificationMethod('all')}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    All Methods
                  </Button>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-[#004E7C]">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any context or special instructions for staff..."
                  className="min-h-[100px] border-[#A0D6D3] focus:ring-[#004E7C]"
                />
              </div>
            </>
          )}

          {/* Status Updates (when escalated) */}
          {( isEscalation) && (
            
            <div className="space-y-3">
              
              <h4 className="text-sm text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Status Updates
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-green-900">Escalation notification sent</p>
                    <p className="text-xs text-green-700">Just now</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900">Staff member assigned</p>
                    <p className="text-xs text-blue-700">Expected contact in {formatTime(timeRemaining)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {!isEscalation ? (
              <>
                <Button
                  onClick={handleEscalate}
                  className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Escalate to Staff Now
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="h-12 border-[#004E7C] text-[#004E7C]"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={onClose}
                className="flex-1 h-12 bg-[#004E7C] text-white hover:bg-[#003D5F]"
              >
                Close 
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
