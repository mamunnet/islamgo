import { useState, useEffect } from 'react';

interface Dhikr {
  id: number;
  arabic: string;
  bengali: string;
  count: number;
  target: number;
}

const TasbihCounter = () => {
  const [count, setCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState<number>(0);
  const [vibrate, setVibrate] = useState(true);
  const [sound, setSound] = useState(true);
  const [hasVibrationSupport, setHasVibrationSupport] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Function to handle vibration
  const vibrateDevice = (pattern: number | number[]) => {
    if (vibrate && hasVibrationSupport) {
      try {
        // For Android Chrome, we need to ensure the pattern is an array
        const vibrationPattern = Array.isArray(pattern) ? pattern : [pattern];
        window.navigator.vibrate(vibrationPattern);
      } catch (error) {
        console.log('Vibration error:', error);
      }
    }
  };

  useEffect(() => {
    // Check for vibration support when component mounts
    const checkVibrationSupport = () => {
      if (typeof window !== 'undefined' && 
          window.navigator && 
          window.navigator.vibrate) {
        setHasVibrationSupport(true);
        // Test vibration with minimal duration
        window.navigator.vibrate(1);
      }
    };

    checkVibrationSupport();
  }, []);

  // Create audio elements
  const clickSound = new Audio('https://www.soundjay.com/button/button-09a.mp3');
  const completeSound = new Audio('https://www.soundjay.com/button/button-10.mp3');
  const resetSound = new Audio('https://www.soundjay.com/button/button-50.mp3');

  // Function to play sound
  const playSound = (audio: HTMLAudioElement) => {
    if (sound) {
      audio.currentTime = 0; // Reset to start
      audio.play().catch(err => console.log('Error playing sound:', err));
    }
  };

  const dhikrList: Dhikr[] = [
    {
      id: 1,
      arabic: 'سُبْحَانَ اللّٰهِ',
      bengali: 'সুবহানাল্লাহ',
      count: 0,
      target: 33
    },
    {
      id: 2,
      arabic: 'اَلْحَمْدُ لِلّٰهِ',
      bengali: 'আলহামদুলিল্লাহ',
      count: 0,
      target: 33
    },
    {
      id: 3,
      arabic: 'اللّٰهُ أَكْبَرُ',
      bengali: 'আল্লাহু আকবার',
      count: 0,
      target: 34
    },
    {
      id: 4,
      arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
      bengali: 'লা ইলাহা ইল্লাল্লাহ',
      count: 0,
      target: 100
    }
  ];

  const handleCount = () => {
    setCount(prev => {
      const newCount = prev + 1;
      
      // Check if current dhikr is completed
      if (newCount === dhikrList[selectedDhikr].target) {
        // Play completion sound and vibrate
        vibrateDevice([100, 50, 100]);
        playSound(completeSound);
        
        // Automatically move to next dhikr if not on the last one
        if (selectedDhikr < 2) { // Only auto-progress for first 3 dhikrs
          // Show notification
          setNotificationMessage(`${dhikrList[selectedDhikr].bengali} সম্পন্ন! ${dhikrList[selectedDhikr + 1].bengali} শুরু করুন`);
          setShowNotification(true);
          
          setTimeout(() => {
            setSelectedDhikr(selectedDhikr + 1);
            setCount(0);
            setShowNotification(false);
          }, 1500); // Wait 1.5 seconds before moving to next dhikr
        } else {
          // Show completion notification for final dhikr
          setNotificationMessage('মাশাআল্লাহ! সবগুলো তাসবিহ সম্পন্ন হয়েছে।');
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
      } else {
        vibrateDevice(30);
        playSound(clickSound);
      }

      return newCount;
    });
  };

  const resetCount = () => {
    setCount(0);
    setSelectedDhikr(0); // Reset to first dhikr (Subhanallah)
    vibrateDevice([50, 25, 50]);
    playSound(resetSound);
  };

  // Calculate beads positions in a circle
  const createBeads = () => {
    const beads = [];
    const totalBeads = dhikrList[selectedDhikr].target;
    const radius = 120; // Radius of the circle
    const centerX = 150; // Center X coordinate
    const centerY = 150; // Center Y coordinate

    for (let i = 0; i < totalBeads; i++) {
      const angle = (i * 2 * Math.PI) / totalBeads - Math.PI / 2; // Start from top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      beads.push({ x, y, active: i < count });
    }
    return beads;
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-[#4E5BA1] rounded-lg overflow-hidden shadow-lg">
        {/* Notification */}
        {showNotification && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg animate-fade-in-down">
            {notificationMessage}
          </div>
        )}
        
        {/* Header */}
        <div className="p-4 text-white text-center">
          <h1 className="text-3xl font-bold mb-4">ডিজিটাল তাসবিহ</h1>
          
          {/* Settings */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setVibrate(!vibrate)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                vibrate ? 'bg-white text-[#4E5BA1]' : 'bg-white/20 text-white'
              }`}
            >
              {vibrate ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5z" clipRule="evenodd" />
                </svg>
              )}
              স্পন্দন
            </button>
            <button
              onClick={() => setSound(!sound)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                sound ? 'bg-white text-[#4E5BA1]' : 'bg-white/20 text-white'
              }`}
            >
              {sound ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 1.414L15 10l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
              শব্দ
            </button>
          </div>

          {/* Dhikr Selection */}
          <select
            value={selectedDhikr}
            onChange={(e) => {
              setSelectedDhikr(Number(e.target.value));
              setCount(0);
            }}
            className="w-full p-2 mb-4 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {dhikrList.map((dhikr, index) => (
              <option key={dhikr.id} value={index} className="bg-[#4E5BA1] text-white">
                {dhikr.bengali} ({dhikr.arabic})
              </option>
            ))}
          </select>
        </div>

        {/* Tasbih Beads */}
        <div className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#4E5BA1] to-[#3A4578]">
          <div className="relative w-[300px] h-[300px]">
            {/* Beads Circle */}
            <svg className="w-full h-full" viewBox="0 0 300 300">
              {/* Draw thread */}
              <circle
                cx="150"
                cy="150"
                r="120"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              
              {/* Draw beads */}
              {createBeads().map((bead, index) => (
                <g key={index} className="transition-all duration-300">
                  {/* Bead shadow */}
                  <circle
                    cx={bead.x}
                    cy={bead.y}
                    r="8"
                    fill="rgba(0,0,0,0.2)"
                    transform="translate(2, 2)"
                  />
                  {/* Bead */}
                  <circle
                    cx={bead.x}
                    cy={bead.y}
                    r="8"
                    className={`transition-colors duration-300 ${
                      bead.active 
                        ? 'fill-red-500 stroke-red-600' 
                        : 'fill-white stroke-gray-200'
                    }`}
                    strokeWidth="1"
                  />
                </g>
              ))}
              
              {/* Counter Display */}
              <g className="text-center">
                <text
                  x="150"
                  y="140"
                  textAnchor="middle"
                  className="text-4xl font-bold fill-white"
                  style={{ fontSize: '2.5rem' }}
                >
                  {count}
                </text>
                <text
                  x="150"
                  y="170"
                  textAnchor="middle"
                  className="text-xl fill-white opacity-75"
                >
                  / {dhikrList[selectedDhikr].target}
                </text>
              </g>
            </svg>
          </div>

          {/* Arabic Text */}
          <div className="mt-6 text-center">
            <div className="text-3xl font-arabic text-white mb-2" style={{ fontFamily: 'Noto Naskh Arabic, serif' }}>
              {dhikrList[selectedDhikr].arabic}
            </div>
            <div className="text-xl text-white/80">
              {dhikrList[selectedDhikr].bengali}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={resetCount}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              রিসেট
            </button>
            <button
              onClick={handleCount}
              className="px-10 py-3 rounded-full bg-white text-[#4E5BA1] hover:bg-white/90 transition-colors text-lg font-semibold"
            >
              গণনা
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasbihCounter;
