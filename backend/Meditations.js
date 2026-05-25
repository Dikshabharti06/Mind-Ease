
const mongoose = require('mongoose');
const Meditation = require('./models/Meditation'); 
const dotenv = require('dotenv');
dotenv.config();

// Sample meditation data with YouTube video links
const meditations = [
  {
    title: 'Morning Calm',
    description: 'Start your day with peace and tranquility.',
    duration: '10 minutes',
    category: 'Morning',
    videoUrl: 'https://www.youtube.com/embed/IvjMgVS6kng',
    imageUrl: 'https://media.istockphoto.com/id/1407786189/photo/the-morning-of-the-lake-with-red-colored-leaves.jpg?s=612x612&w=0&k=20&c=r3YbSr39ypuWXU85T8ssnrqPTK4zmyAJdYV48V43MuY=',
  },
  {
    title: 'Evening Relaxation',
    description: 'Unwind after a long day with this soothing session.',
    duration: '15 minutes',
    category: 'Evening',
    videoUrl: 'https://www.youtube.com/embed/sjkrrmBnpGE',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1666358432775-fc087922c744?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FsbSUyMG5pZ2h0fGVufDB8fDB8fHww',
  },
  {
    title: 'Deep Sleep',
    description: 'Fall asleep faster and sleep more soundly.',
    duration: '20 minutes',
    category: 'Night',
    videoUrl: 'https://www.youtube.com/embed/bP9gMpl1gyQ',
    imageUrl: 'https://media.istockphoto.com/id/1555115916/photo/top-view-of-young-woman-sleeping-in-her-bed-at-night-girl-sleeping-with-closed-eyes.jpg?s=1024x1024&w=is&k=20&c=I7WwP7wA8rHPmKWxs3WjTKOUlHpPYUaxFQMvOCRr8E4=',
  },
  {
    title: 'Stress Relief',
    description: 'Reduce stress and anxiety with this calming session.',
    duration: '12 minutes',
    category: 'Stress',
    videoUrl: 'https://www.youtube.com/embed/Jyy0ra2WcQQ',
    imageUrl: 'https://media.istockphoto.com/id/1134255822/photo/handsome-hispanic-man-wearing-casual-sweater-at-home-relax-and-smiling-with-eyes-closed-doing.jpg?s=1024x1024&w=is&k=20&c=NFuusc-Ry4m2NJrSjTsYDdE50FMMKWFPMWMKbrEqTvw=',
  },
  {
    title: 'Focus Boost',
    description: 'Improve your concentration and productivity.',
    duration: '8 minutes',
    category: 'Focus',
    videoUrl: 'https://www.youtube.com/embed/SRaW5PIiQh0',
    imageUrl: 'https://media.istockphoto.com/id/2055293612/photo/beautiful-indian-gen-z-woman-in-sportswear-doing-workout-in-bright-sunny-morning-practising.jpg?s=612x612&w=0&k=20&c=56CXUtwHEdy-92p7-guDuf2SEFnO2sZTWCRtt9ZxrQs=',
  },
  {
    title: 'Overthinking Relief',
    description: 'Calm your busy mind and find mental clarity with this guided practice.',
    duration: '15 minutes',
    category: 'Mindfulness',
    videoUrl: 'https://www.youtube.com/embed/ez3GgRqhNvA',
    imageUrl: 'https://media.istockphoto.com/id/1368453713/photo/woman-meditating-in-lotus-pose-on-lake-pier-at-sunset.jpg?s=612x612&w=0&k=20&c=PDzWwCuFwm-FHzD3g2lWn-5pF8Z8j9T6JAN_PX9J1Ro=',
  },
  {
    title: 'Anxiety Reducer',
    description: 'Find relief from anxiety with this calming audio session.',
    duration: '18 minutes',
    category: 'Anxiety Relief',
    videoUrl: 'https://www.youtube.com/embed/O-6f5wQXSu8',
    imageUrl: 'https://media.istockphoto.com/id/1356418105/photo/worried-young-woman-suffering-from-depression-and-stress.jpg?s=612x612&w=0&k=20&c=O3sWI0AUxJsyTcCXYffP4BPqsLANDN4QW75P2iFO7Pc=',
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    // Insert data
    return Meditation.insertMany(meditations);
  })
  .then(() => {
    console.log('Meditations seeded successfully');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error seeding meditations:', err);
    mongoose.connection.close();
  });
