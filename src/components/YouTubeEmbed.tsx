import { useState } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  thumbnail: string;
  className?: string;
}

export const YouTubeEmbed = ({ videoId, title, thumbnail, className = '' }: YouTubeEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <motion.div 
      className={`relative aspect-video rounded-3xl overflow-hidden bg-card shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {isPlaying ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          onClick={handlePlay}
          className="group w-full h-full relative cursor-pointer focus:outline-none"
          aria-label={`Play ${title}`}
        >
          {/* Thumbnail */}
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-foreground fill-foreground ml-1" />
            </div>
          </div>
        </button>
      )}
    </motion.div>
  );
};
