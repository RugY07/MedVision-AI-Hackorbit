import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff,
  Share,
  UserPlus,
  Crown,
  Circle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CollaborationWorkspaceProps {
  scanData: any;
  selectedOrgan: string;
}

export const CollaborationWorkspace: React.FC<CollaborationWorkspaceProps> = ({
  scanData,
  selectedOrgan
}) => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [annotations, setAnnotations] = useState<any[]>([]);

  useEffect(() => {
    // Mock active users
    setActiveUsers([
      {
        id: 1,
        name: 'Dr. Sarah Smith',
        role: 'Radiologist',
        avatar: '/placeholder-avatar.jpg',
        status: 'online',
        isHost: true
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        role: 'Cardiologist',
        avatar: '/placeholder-avatar.jpg',
        status: 'online',
        isHost: false
      },
      {
        id: 3,
        name: 'Dr. Emily Johnson',
        role: 'Resident',
        avatar: '/placeholder-avatar.jpg',
        status: 'away',
        isHost: false
      }
    ]);

    // Mock messages
    setMessages([
      {
        id: 1,
        user: 'Dr. Sarah Smith',
        message: 'I can see some interesting findings in the left ventricle.',
        timestamp: new Date(Date.now() - 300000),
        type: 'message'
      },
      {
        id: 2,
        user: 'Dr. Michael Chen',
        message: 'Agreed. The wall motion appears slightly reduced in that region.',
        timestamp: new Date(Date.now() - 240000),
        type: 'message'
      },
      {
        id: 3,
        user: 'System',
        message: 'Dr. Emily Johnson joined the session',
        timestamp: new Date(Date.now() - 180000),
        type: 'system'
      }
    ]);

    // Mock annotations
    setAnnotations([
      {
        id: 1,
        user: 'Dr. Sarah Smith',
        x: 45,
        y: 60,
        note: 'Possible hypertrophy',
        timestamp: new Date(Date.now() - 120000)
      },
      {
        id: 2,
        user: 'Dr. Michael Chen',
        x: 55,
        y: 40,
        note: 'Normal valve function',
        timestamp: new Date(Date.now() - 60000)
      }
    ]);
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      user: 'Dr. Sarah Smith',
      message: message.trim(),
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Collaboration View */}
      <div className="lg:col-span-2 space-y-6">
        {/* Video Conference */}
        <Card className="holographic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Live Consultation
              <Badge variant="outline" className="ml-auto">
                {activeUsers.filter(u => u.status === 'online').length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
              {/* Main Video Feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Video Conference</h3>
                  <p className="text-muted-foreground">
                    {isVideoOn ? 'Camera is on' : 'Camera is off'}
                  </p>
                </div>
              </div>

              {/* Participant Videos */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {activeUsers.slice(0, 3).map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center relative"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}></div>
                  </motion.div>
                ))}
              </div>

              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <Button
                  variant={isMicOn ? "default" : "destructive"}
                  size="sm"
                  onClick={() => setIsMicOn(!isMicOn)}
                >
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="sm"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collaborative Annotation */}
        <Card className="holographic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share className="w-5 h-5 text-primary" />
              Shared Scan View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
              {scanData ? (
                <div className="relative w-full h-full">
                  {/* Scan Image Placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                        <div className="text-4xl">🫀</div>
                      </div>
                      <h3 className="text-lg font-semibold">{selectedOrgan} Scan</h3>
                    </div>
                  </div>

                  {/* Annotations */}
                  {annotations.map((annotation) => (
                    <motion.div
                      key={annotation.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white cursor-pointer"
                      style={{
                        left: `${annotation.x}%`,
                        top: `${annotation.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      title={`${annotation.user}: ${annotation.note}`}
                    >
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg p-2 text-xs whitespace-nowrap z-10 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="font-semibold">{annotation.user}</div>
                        <div>{annotation.note}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Share className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Scan Shared</h3>
                    <p className="text-muted-foreground">Upload a scan to start collaboration</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Active Participants */}
        <Card className="holographic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Participants ({activeUsers.length})
              <Button variant="ghost" size="sm" className="ml-auto">
                <UserPlus className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-medium text-sm truncate">{user.name}</h4>
                      {user.isHost && <Crown className="w-3 h-3 text-yellow-400" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                  <Circle className={`w-2 h-2 ${getStatusColor(user.status)}`} />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="holographic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Discussion
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-64 p-4">
              <div className="space-y-3">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`${msg.type === 'system' ? 'text-center' : ''}`}
                    >
                      {msg.type === 'system' ? (
                        <div className="text-xs text-muted-foreground italic">
                          {msg.message}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">{msg.user}</span>
                            <span className="text-xs text-muted-foreground">
                              {msg.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-sm bg-muted/50 rounded-lg p-2">
                            {msg.message}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="sm">
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};