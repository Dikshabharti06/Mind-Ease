
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Moon, Sun, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SleepRecord {
  id: string;
  date: string;
  sleepTime: string;
  wakeTime: string;
  quality: number;
  duration: number;
  notes: string;
  updated?: boolean;
  message?: string;
}

interface TimeValue {
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
}

const SleepTracker = () => {
  const { toast } = useToast();
  const [sleepTime, setSleepTime] = useState<TimeValue>({
    hour: '10',
    minute: '00',
    period: 'PM'
  });
  const [wakeTime, setWakeTime] = useState<TimeValue>({
    hour: '06',
    minute: '00',
    period: 'AM'
  });
  const [quality, setQuality] = useState(7);
  const [notes, setNotes] = useState('');
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(true);

  // Load sleep records on component mount
  React.useEffect(() => {
    loadSleepRecords();
  }, []);

  const loadSleepRecords = async () => {
    setRecordsLoading(true);
    try {
      const response = await api.getSleepRecords();
      if (response.data) {
        setSleepRecords(response.data);
      }
    } catch (error) {
      console.error('Failed to load sleep records:', error);
      toast({
        title: "Error",
        description: "Failed to load sleep records. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRecordsLoading(false);
    }
  };

  // Convert time from 12-hour format to 24-hour format
  const convertTo24Hour = (timeValue: TimeValue): string => {
    let hour = parseInt(timeValue.hour, 10);
    
    // Convert 12-hour format to 24-hour format
    if (timeValue.period === 'PM' && hour < 12) {
      hour += 12;
    } else if (timeValue.period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    return `${hour.toString().padStart(2, '0')}:${timeValue.minute}`;
  };

  // Convert time from 24-hour format to 12-hour format
  const convertTo12Hour = (time24: string): TimeValue => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12
    
    return {
      hour: hours12.toString(),
      minute: minutes.toString().padStart(2, '0'),
      period: period as 'AM' | 'PM'
    };
  };

  const calculateDuration = (sleepTime: string, wakeTime: string) => {
    const [sleepHours, sleepMinutes] = sleepTime.split(':').map(Number);
    const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
    
    let sleepDate = new Date();
    sleepDate.setHours(sleepHours, sleepMinutes, 0);
    
    let wakeDate = new Date();
    wakeDate.setHours(wakeHours, wakeMinutes, 0);
    
    // If wake time is earlier than sleep time, add a day to wake time
    if (wakeDate.getTime() < sleepDate.getTime()) {
      wakeDate.setDate(wakeDate.getDate() + 1);
    }
    
    // Calculate difference in hours
    const diff = (wakeDate.getTime() - sleepDate.getTime()) / (1000 * 60 * 60);
    return parseFloat(diff.toFixed(1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sleep24Hour = convertTo24Hour(sleepTime);
    const wake24Hour = convertTo24Hour(wakeTime);
    const duration = calculateDuration(sleep24Hour, wake24Hour);
    
    if (duration < 0 || duration > 24) {
      toast({
        title: "Invalid sleep duration",
        description: "Please check your sleep and wake times.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.saveSleepRecord({
        sleepTime: sleep24Hour,
        wakeTime: wake24Hour,
        quality,
        duration,
        notes,
        date: new Date().toISOString(),
      });
      
      if (response.data) {
        // Check if this was an update or a new record
        if (response.data.updated) {
          toast({
            title: "Sleep record updated",
            description: "Your existing sleep record for today has been updated.",
          });
        } else {
          toast({
            title: "Sleep record saved",
            description: "Your sleep record has been saved successfully.",
          });
        }
        
        // Reset form
        setNotes('');
        
        // Reload records
        loadSleepRecords();
      } else {
        throw new Error(response.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Failed to save sleep record:', error);
      toast({
        title: "Error",
        description: "Failed to save sleep record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getQualityLabel = (quality: number) => {
    if (quality <= 3) return 'Poor';
    if (quality <= 6) return 'Average';
    if (quality <= 8) return 'Good';
    return 'Excellent';
  };

  const getSleepStatusMessage = (records: SleepRecord[]) => {
    if (records.length === 0) return null;
    
    // Calculate average duration
    const avgDuration = records.reduce((sum, record) => sum + record.duration, 0) / records.length;
    
    // Calculate average quality
    const avgQuality = records.reduce((sum, record) => sum + record.quality, 0) / records.length;
    
    let message = '';
    
    if (avgDuration < 6) {
      message = "You're not getting enough sleep. Try to get at least 7-8 hours of sleep each night.";
    } else if (avgDuration > 9) {
      message = "You might be sleeping too much. 7-8 hours of sleep is typically optimal for adults.";
    } else {
      message = "Your sleep duration looks good. Keep it up!";
    }
    
    if (avgQuality < 5) {
      message += " Your sleep quality could be better. Consider improving your sleep environment or routine.";
    } else {
      message += " And your sleep quality is good!";
    }
    
    return message;
  };

  const chartData = sleepRecords.slice(-7).map(record => {
    // If we have records in 24h format, convert them for display
    const displaySleep = record.sleepTime.includes(':') 
      ? convertTo12Hour(record.sleepTime) 
      : { hour: '10', minute: '00', period: 'PM' };
      
    const displayWake = record.wakeTime.includes(':') 
      ? convertTo12Hour(record.wakeTime) 
      : { hour: '6', minute: '00', period: 'AM' };

    return {
      date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      duration: record.duration,
      quality: record.quality / 10 * record.duration, // Scale quality to fit with duration
      sleepTime: `${displaySleep.hour}:${displaySleep.minute} ${displaySleep.period}`,
      wakeTime: `${displayWake.hour}:${displayWake.minute} ${displayWake.period}`
    };
  });

  // Generate hours for select options (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  
  // Generate minutes for select options (00, 15, 30, 45)
  const minutes = ['00', '15', '30', '45'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Moon className="mr-2 h-5 w-5" />
            Track Your Sleep
          </CardTitle>
          <CardDescription>
            Record your sleep times and quality to help improve your sleep habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sleepTime" className="flex items-center">
                  <Moon className="mr-2 h-4 w-4 text-muted-foreground" />
                  Bedtime
                </Label>
                <div className="flex items-center space-x-2">
                  <Select
                    value={sleepTime.hour}
                    onValueChange={(value) => setSleepTime({...sleepTime, hour: value})}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map(hour => (
                        <SelectItem key={`sleep-hour-${hour}`} value={hour}>{hour}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span>:</span>
                  
                  <Select
                    value={sleepTime.minute}
                    onValueChange={(value) => setSleepTime({...sleepTime, minute: value})}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {minutes.map(min => (
                        <SelectItem key={`sleep-min-${min}`} value={min}>{min}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={sleepTime.period}
                    onValueChange={(value) => setSleepTime({...sleepTime, period: value as 'AM' | 'PM'})}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="AM/PM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wakeTime" className="flex items-center">
                  <Sun className="mr-2 h-4 w-4 text-muted-foreground" />
                  Wake Time
                </Label>
                <div className="flex items-center space-x-2">
                  <Select
                    value={wakeTime.hour}
                    onValueChange={(value) => setWakeTime({...wakeTime, hour: value})}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map(hour => (
                        <SelectItem key={`wake-hour-${hour}`} value={hour}>{hour}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <span>:</span>
                  
                  <Select
                    value={wakeTime.minute}
                    onValueChange={(value) => setWakeTime({...wakeTime, minute: value})}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {minutes.map(min => (
                        <SelectItem key={`wake-min-${min}`} value={min}>{min}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={wakeTime.period}
                    onValueChange={(value) => setWakeTime({...wakeTime, period: value as 'AM' | 'PM'})}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="AM/PM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="quality" className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
                  Sleep Quality ({getQualityLabel(quality)})
                </Label>
                <span className="text-sm text-muted-foreground">{quality}/10</span>
              </div>
              <Slider
                id="quality"
                min={1}
                max={10}
                step={1}
                value={[quality]}
                onValueChange={(value) => setQuality(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Any factors affecting your sleep? (stress, caffeine, etc.)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="bg-muted p-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                You can only record one sleep entry per day. If you've already recorded sleep for today, 
                this will update your existing entry.
              </p>
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Sleep Record"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Sleep Insights
          </CardTitle>
          <CardDescription>
            Visualize your sleep patterns over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recordsLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <p>Loading sleep records...</p>
            </div>
          ) : sleepRecords.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">No sleep records yet. Start tracking your sleep above.</p>
            </div>
          ) : (
            <>
              <div className="h-[300px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => `Date: ${label}`}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background p-3 border rounded shadow-sm">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm">Sleep time: {data.sleepTime}</p>
                              <p className="text-sm">Wake time: {data.wakeTime}</p>
                              <p className="text-sm">Duration: {data.duration} hours</p>
                              <p className="text-sm">Quality: {Math.round(data.quality / data.duration * 10)}/10</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="duration" name="Sleep Duration (hours)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2 flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analysis
                </h4>
                <p>{getSleepStatusMessage(sleepRecords)}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepTracker;
