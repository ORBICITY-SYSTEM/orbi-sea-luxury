import { motion } from 'framer-motion';

interface VideoTourCardProps {
  videoSrc: string;
  title: string;
  description: string;
  index?: number;
}

export const VideoTourCard = ({ videoSrc, title, description, index = 0 }: VideoTourCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="rounded-2xl overflow-hidden bg-card border-2 border-border/30 hover:border-primary/50 transition-all duration-500 group shadow-lg"
    >
      <div className="relative h-[400px] overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
      <div className="p-6 bg-card">
        <h3 className="text-2xl font-serif font-light text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground font-light leading-relaxed">
          {description}
        </p>
      </div>
    </motion.article>
  );
};
