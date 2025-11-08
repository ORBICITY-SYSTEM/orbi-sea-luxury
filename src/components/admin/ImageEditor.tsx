import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage, filters } from 'fabric';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Crop, Maximize2, Palette, RotateCw, Save } from 'lucide-react';

interface ImageEditorProps {
  open: boolean;
  onClose: () => void;
  imageFile: File | null;
  onSave: (editedBlob: Blob) => void;
}

export const ImageEditor = ({ open, onClose, imageFile, onSave }: ImageEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeImage, setActiveImage] = useState<FabricImage | null>(null);
  const { toast } = useToast();

  // Filter states
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [blur, setBlur] = useState(0);

  useEffect(() => {
    if (!canvasRef.current || !open) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f5f5f5',
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [open]);

  useEffect(() => {
    if (!fabricCanvas || !imageFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.src = e.target?.result as string;
      
      imgElement.onload = () => {
        FabricImage.fromURL(imgElement.src).then((img) => {
          // Scale image to fit canvas
          const scale = Math.min(
            (fabricCanvas.width! * 0.9) / img.width!,
            (fabricCanvas.height! * 0.9) / img.height!
          );
          
          img.scale(scale);
          img.set({
            left: fabricCanvas.width! / 2,
            top: fabricCanvas.height! / 2,
            originX: 'center',
            originY: 'center',
          });
          
          fabricCanvas.clear();
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.renderAll();
          
          setActiveImage(img);
        });
      };
    };
    
    reader.readAsDataURL(imageFile);
  }, [fabricCanvas, imageFile]);

  const applyFilters = () => {
    if (!activeImage) return;

    const filterArray: any[] = [];

    if (brightness !== 0) {
      filterArray.push(new filters.Brightness({ brightness: brightness / 100 }));
    }
    if (contrast !== 0) {
      filterArray.push(new filters.Contrast({ contrast: contrast / 100 }));
    }
    if (saturation !== 0) {
      filterArray.push(new filters.Saturation({ saturation: saturation / 100 }));
    }
    if (blur > 0) {
      filterArray.push(new filters.Blur({ blur: blur / 100 }));
    }

    activeImage.filters = filterArray;
    activeImage.applyFilters();
    fabricCanvas?.renderAll();
  };

  useEffect(() => {
    applyFilters();
  }, [brightness, contrast, saturation, blur]);

  const handleRotate = () => {
    if (!activeImage) return;
    activeImage.rotate((activeImage.angle || 0) + 90);
    fabricCanvas?.renderAll();
  };

  const handleCrop = () => {
    if (!activeImage || !fabricCanvas) return;
    
    // Enable cropping mode
    activeImage.set({
      lockRotation: false,
      lockScalingX: false,
      lockScalingY: false,
    });
    
    fabricCanvas.setActiveObject(activeImage);
    fabricCanvas.renderAll();
    
    toast({
      title: 'Crop Mode',
      description: 'Resize the image and click Save to crop',
    });
  };

  const handleResize = (percentage: number) => {
    if (!activeImage || !fabricCanvas) return;
    
    const newScale = (activeImage.scaleX || 1) * (percentage / 100);
    activeImage.scale(newScale);
    activeImage.set({
      left: fabricCanvas.width! / 2,
      top: fabricCanvas.height! / 2,
      originX: 'center',
      originY: 'center',
    });
    fabricCanvas?.renderAll();
  };

  const handleSave = () => {
    if (!fabricCanvas) return;

    // Export canvas as blob
    fabricCanvas.renderAll();
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2, // Higher resolution
    });

    // Convert data URL to blob
    fetch(dataURL)
      .then(res => res.blob())
      .then(blob => {
        onSave(blob);
        toast({
          title: 'Success',
          description: 'Image edited successfully',
        });
      })
      .catch(error => {
        console.error('Error saving image:', error);
        toast({
          title: 'Error',
          description: 'Failed to save edited image',
          variant: 'destructive',
        });
      });
  };

  const resetFilters = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setBlur(0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Canvas */}
          <div className="border rounded-lg overflow-hidden bg-muted">
            <canvas ref={canvasRef} />
          </div>

          {/* Controls */}
          <Tabs defaultValue="transform" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transform">
                <Crop className="h-4 w-4 mr-2" />
                Transform
              </TabsTrigger>
              <TabsTrigger value="resize">
                <Maximize2 className="h-4 w-4 mr-2" />
                Resize
              </TabsTrigger>
              <TabsTrigger value="filters">
                <Palette className="h-4 w-4 mr-2" />
                Filters
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transform" className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleRotate} variant="outline">
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotate 90°
                </Button>
                <Button onClick={handleCrop} variant="outline">
                  <Crop className="h-4 w-4 mr-2" />
                  Enable Crop Mode
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="resize" className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => handleResize(150)} variant="outline">
                  Increase 50%
                </Button>
                <Button onClick={() => handleResize(75)} variant="outline">
                  Decrease 25%
                </Button>
                <Button onClick={() => handleResize(200)} variant="outline">
                  Double Size
                </Button>
                <Button onClick={() => handleResize(50)} variant="outline">
                  Half Size
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Brightness: {brightness}</Label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(v) => setBrightness(v[0])}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contrast: {contrast}</Label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(v) => setContrast(v[0])}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Saturation: {saturation}</Label>
                  <Slider
                    value={[saturation]}
                    onValueChange={(v) => setSaturation(v[0])}
                    min={-100}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Blur: {blur}</Label>
                  <Slider
                    value={[blur]}
                    onValueChange={(v) => setBlur(v[0])}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>

                <Button onClick={resetFilters} variant="outline" className="w-full">
                  Reset Filters
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};