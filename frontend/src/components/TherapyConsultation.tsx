
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Heart, Clock, UserCheck, Stethoscope, PhoneCall, Calendar as CalendarIcon } from 'lucide-react';
import { api } from '@/services/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const therapySpecialties = [
  { id: 'anxiety', name: 'Anxiety & Stress' },
  { id: 'depression', name: 'Depression' },
  { id: 'overthinking', name: 'Overthinking & Rumination' },
  { id: 'relationships', name: 'Relationship Issues' },
  { id: 'trauma', name: 'Trauma & PTSD' },
  { id: 'selfesteem', name: 'Self-Esteem' },
  { id: 'grief', name: 'Grief & Loss' },
  { id: 'addiction', name: 'Addiction Recovery' },
  { id: 'other', name: 'Other Concerns' },
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

interface Therapist {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experience: string;
  image: string;
  bio: string;
  availability: string[];
}

const TherapyConsultation = () => {
  const { toast } = useToast();
  const [specialty, setSpecialty] = useState('');
  const [preferredDate, setPreferredDate] = useState<Date | undefined>(undefined);
  const [preferredTime, setPreferredTime] = useState('');
  const [consultationType, setConsultationType] = useState('video');
  const [concerns, setConcerns] = useState('');
  const [loading, setLoading] = useState(false);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [therapistsLoading, setTherapistsLoading] = useState(false);
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  // Mock therapists data (in a real app, this would come from an API)
  React.useEffect(() => {
    const mockTherapists: Therapist[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        title: 'Clinical Psychologist',
        specialties: ['anxiety', 'depression', 'overthinking'],
        experience: '12 years',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        bio: 'Dr. Johnson specializes in cognitive-behavioral therapy and helps clients manage anxiety, depression, and overthinking patterns.',
        availability: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM']
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        title: 'Psychiatrist',
        specialties: ['depression', 'trauma', 'addiction'],
        experience: '15 years',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        bio: 'Dr. Chen combines medication management with talk therapy to provide comprehensive care for complex mental health conditions.',
        availability: ['11:00 AM', '1:00 PM', '4:00 PM', '5:00 PM']
      },
      {
        id: '3',
        name: 'Priya Sharma',
        title: 'Licensed Therapist',
        specialties: ['relationships', 'selfesteem', 'overthinking'],
        experience: '8 years',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        bio: 'Priya specializes in relationship issues and helping clients build self-esteem while breaking cycles of overthinking.',
        availability: ['9:00 AM', '1:00 PM', '2:00 PM', '5:00 PM']
      },
      {
        id: '4',
        name: 'Dr. James Wilson',
        title: 'Psychotherapist',
        specialties: ['grief', 'trauma', 'anxiety'],
        experience: '20 years',
        image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        bio: 'Dr. Wilson has extensive experience helping clients work through grief, trauma, and anxiety with compassionate care.',
        availability: ['10:00 AM', '11:00 AM', '3:00 PM', '4:00 PM']
      }
    ];
    
    setTherapists(mockTherapists);
  }, []);

  const findTherapists = () => {
    if (!specialty) {
      toast({
        title: "Please select a specialty",
        description: "We need to know what type of support you're looking for.",
        variant: "destructive",
      });
      return;
    }
    
    setTherapistsLoading(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      const filteredTherapists = therapists.filter(therapist => 
        therapist.specialties.includes(specialty)
      );
      
      setTherapists(filteredTherapists);
      setTherapistsLoading(false);
      
      if (filteredTherapists.length === 0) {
        toast({
          title: "No therapists found",
          description: "We couldn't find therapists for this specialty. Please try another option.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const handleBookAppointment = async () => {
    if (!selectedTherapist || !preferredDate || !preferredTime) {
      toast({
        title: "Incomplete information",
        description: "Please select a therapist, date, and time for your appointment.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAppointmentBooked(true);
      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${selectedTherapist.name} has been scheduled for ${format(preferredDate, 'PPP')} at ${preferredTime}.`,
      });
      
      // Reset form
      setSelectedTherapist(null);
      setPreferredDate(undefined);
      setPreferredTime('');
      setConcerns('');
      
    } catch (error) {
      console.error('Failed to book appointment:', error);
      toast({
        title: "Booking failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Professional Therapy Consultation
          </CardTitle>
          <CardDescription>
            Connect with licensed therapists specialized in managing overthinking and stress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">What type of support are you looking for?</Label>
              <Select
                value={specialty}
                onValueChange={setSpecialty}
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="Select a specialty" />
                </SelectTrigger>
                <SelectContent>
                  {therapySpecialties.map(specialty => (
                    <SelectItem key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={findTherapists} disabled={therapistsLoading}>
              {therapistsLoading ? "Finding Therapists..." : "Find Therapists"}
            </Button>
            
            {therapists.length > 0 && !therapistsLoading && (
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Available Therapists</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {therapists.map(therapist => (
                    <Card 
                      key={therapist.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${selectedTherapist?.id === therapist.id ? 'border-2 border-primary' : ''}`}
                      onClick={() => setSelectedTherapist(therapist)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img 
                              src={therapist.image} 
                              alt={therapist.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{therapist.name}</h4>
                            <p className="text-sm text-muted-foreground">{therapist.title}</p>
                            <p className="text-xs mt-1">Experience: {therapist.experience}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {therapist.specialties.map(spec => {
                                const specialty = therapySpecialties.find(s => s.id === spec);
                                return (
                                  <span 
                                    key={spec} 
                                    className="text-xs bg-muted px-2 py-1 rounded-full"
                                  >
                                    {specialty?.name}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {selectedTherapist && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">Book an Appointment with {selectedTherapist.name}</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {preferredDate ? format(preferredDate, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={preferredDate}
                              onSelect={setPreferredDate}
                              initialFocus
                              disabled={(date) => 
                                date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                                date.getDay() === 0 || 
                                date.getDay() === 6
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time">Preferred Time</Label>
                        <Select
                          value={preferredTime}
                          onValueChange={setPreferredTime}
                        >
                          <SelectTrigger id="time">
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedTherapist.availability.map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Consultation Type</Label>
                        <RadioGroup
                          value={consultationType}
                          onValueChange={setConsultationType}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="video" id="video" />
                            <Label htmlFor="video">Video Call</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="phone" />
                            <Label htmlFor="phone">Phone Call</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="inperson" id="inperson" />
                            <Label htmlFor="inperson">In-Person (if available in your area)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="concerns">Brief description of your concerns (optional)</Label>
                        <Textarea
                          id="concerns"
                          placeholder="Please share any specific concerns or questions you have for the therapist..."
                          value={concerns}
                          onChange={(e) => setConcerns(e.target.value)}
                          rows={4}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleBookAppointment} 
                        disabled={loading || !preferredDate || !preferredTime}
                        className="w-full"
                      >
                        {loading ? "Booking..." : "Book Appointment"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Information card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Stethoscope className="mr-2 h-5 w-5" />
            Why Consider Professional Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Professional therapy can be beneficial when:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your overthinking is affecting your daily life and relationships</li>
              <li>Self-help techniques haven't provided enough relief</li>
              <li>You're experiencing persistent negative thoughts or emotions</li>
              <li>You want personalized strategies tailored to your specific situation</li>
              <li>You're going through a significant life transition or challenge</li>
            </ul>
            
            <div className="bg-muted p-4 rounded-md mt-4">
              <h4 className="font-medium mb-2 flex items-center">
                <PhoneCall className="mr-2 h-4 w-4" />
                Immediate Support
              </h4>
              <p className="text-sm">
                If you're in crisis or need immediate support, please call the Mental Health Helpline: 
                <strong className="block mt-1">1-800-273-8255</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Success Dialog */}
      <Dialog open={appointmentBooked} onOpenChange={setAppointmentBooked}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Confirmed</DialogTitle>
            <DialogDescription>
              Your therapy consultation has been scheduled successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted rounded-md">
            <p className="font-medium">What happens next?</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>You'll receive a confirmation email with details</li>
              <li>The therapist will review your information</li>
              <li>You'll get a reminder 24 hours before your appointment</li>
              <li>Connect via your chosen consultation method</li>
            </ol>
          </div>
          <DialogFooter>
            <Button onClick={() => setAppointmentBooked(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TherapyConsultation;
