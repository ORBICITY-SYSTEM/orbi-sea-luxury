import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ColorSwatch = ({ 
  name, 
  cssVar, 
  className 
}: { 
  name: string; 
  cssVar: string; 
  className: string;
}) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssVar);
    setCopied(true);
    toast.success(`${cssVar} კოპირებულია!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="group cursor-pointer transition-transform hover:scale-105"
      onClick={copyToClipboard}
    >
      <div className={`h-20 rounded-lg shadow-sm border border-border ${className} relative`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
          {copied ? <Check className="h-5 w-5 text-white" /> : <Copy className="h-5 w-5 text-white" />}
        </div>
      </div>
      <p className="text-sm font-medium mt-2">{name}</p>
      <p className="text-xs text-muted-foreground font-mono">{cssVar}</p>
    </div>
  );
};

const SpacingBox = ({ size, value, pixels }: { size: string; value: string; pixels: string }) => (
  <div className="flex items-center gap-4 py-2">
    <code className="w-16 text-sm font-mono text-muted-foreground">{size}</code>
    <div className="flex-1">
      <div 
        className="bg-secondary/50 rounded" 
        style={{ width: value, height: '24px' }}
      />
    </div>
    <span className="text-xs text-muted-foreground w-20">{value} ({pixels})</span>
  </div>
);

const TypographyExample = ({ 
  className, 
  label, 
  size, 
  lineHeight 
}: { 
  className: string; 
  label: string; 
  size: string; 
  lineHeight: string;
}) => (
  <div className="py-4 border-b border-border last:border-0">
    <div className="flex items-baseline justify-between gap-4 mb-2">
      <code className="text-xs font-mono text-muted-foreground">{className}</code>
      <span className="text-xs text-muted-foreground">{size} / {lineHeight}</span>
    </div>
    <p className={className}>
      {label} — Orbi City Batumi ბათუმი
    </p>
  </div>
);

export function AdminStyleGuide() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Style Guide</h1>
        <p className="text-muted-foreground mt-2">
          Design System Documentation — 4-Point Grid System
        </p>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="colors">ფერები</TabsTrigger>
          <TabsTrigger value="typography">ტიპოგრაფია</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="components">კომპონენტები</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>სემანტიკური ფერები</CardTitle>
              <CardDescription>
                ძირითადი ფერები დიზაინ სისტემისთვის — დააკლიკეთ კოპირებისთვის
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <ColorSwatch name="Background" cssVar="bg-background" className="bg-background" />
                <ColorSwatch name="Foreground" cssVar="text-foreground" className="bg-foreground" />
                <ColorSwatch name="Primary" cssVar="bg-primary" className="bg-primary" />
                <ColorSwatch name="Secondary" cssVar="bg-secondary" className="bg-secondary" />
                <ColorSwatch name="Accent" cssVar="bg-accent" className="bg-accent" />
                <ColorSwatch name="Muted" cssVar="bg-muted" className="bg-muted" />
                <ColorSwatch name="Card" cssVar="bg-card" className="bg-card" />
                <ColorSwatch name="Border" cssVar="border-border" className="bg-border" />
                <ColorSwatch name="Ring" cssVar="ring-ring" className="bg-ring" />
                <ColorSwatch name="Destructive" cssVar="bg-destructive" className="bg-destructive" />
                <ColorSwatch name="Success" cssVar="bg-success" className="bg-success" />
                <ColorSwatch name="Input" cssVar="bg-input" className="bg-input" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Navy პალიტრა</CardTitle>
              <CardDescription>Deep Ocean Blues — Four Seasons სტილი</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                <ColorSwatch name="Navy 50" cssVar="bg-navy-50" className="bg-navy-50" />
                <ColorSwatch name="Navy 100" cssVar="bg-navy-100" className="bg-navy-100" />
                <ColorSwatch name="Navy 200" cssVar="bg-navy-200" className="bg-navy-200" />
                <ColorSwatch name="Navy 300" cssVar="bg-navy-300" className="bg-navy-300" />
                <ColorSwatch name="Navy 400" cssVar="bg-navy-400" className="bg-navy-400" />
                <ColorSwatch name="Navy 500" cssVar="bg-navy-500" className="bg-navy-500" />
                <ColorSwatch name="Navy 600" cssVar="bg-navy-600" className="bg-navy-600" />
                <ColorSwatch name="Navy 700" cssVar="bg-navy-700" className="bg-navy-700" />
                <ColorSwatch name="Navy 800" cssVar="bg-navy-800" className="bg-navy-800" />
                <ColorSwatch name="Navy 900" cssVar="bg-navy-900" className="bg-navy-900" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gold პალიტრა</CardTitle>
              <CardDescription>Luxury Gold — სასტუმროს ხელმოწერა</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <ColorSwatch name="Gold 50" cssVar="bg-gold-50" className="bg-gold-50" />
                <ColorSwatch name="Gold 100" cssVar="bg-gold-100" className="bg-gold-100" />
                <ColorSwatch name="Gold 200" cssVar="bg-gold-200" className="bg-gold-200" />
                <ColorSwatch name="Gold 300" cssVar="bg-gold-300" className="bg-gold-300" />
                <ColorSwatch name="Gold 400" cssVar="bg-gold-400" className="bg-gold-400" />
                <ColorSwatch name="Gold 500" cssVar="bg-gold-500" className="bg-gold-500" />
                <ColorSwatch name="Gold 600" cssVar="bg-gold-600" className="bg-gold-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>გრადიენტები</CardTitle>
              <CardDescription>Premium გრადიენტები ვიზუალური ეფექტებისთვის</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="h-24 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-end p-3">
                  <span className="text-primary-foreground text-sm font-medium">Navy Gradient</span>
                </div>
                <div className="h-24 rounded-lg bg-gradient-to-br from-secondary to-secondary/60 flex items-end p-3">
                  <span className="text-secondary-foreground text-sm font-medium">Gold Gradient</span>
                </div>
                <div className="h-24 rounded-lg bg-gradient-to-br from-primary to-accent flex items-end p-3">
                  <span className="text-primary-foreground text-sm font-medium">Sea Gradient</span>
                </div>
                <div className="h-24 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-end p-3">
                  <span className="text-accent-foreground text-sm font-medium">Turquoise Gradient</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Font Families</CardTitle>
              <CardDescription>Playfair Display (Headings) + Inter (Body)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-lg bg-muted/30">
                <p className="font-serif text-4xl mb-2">Playfair Display</p>
                <p className="text-sm text-muted-foreground">სათაურებისთვის — font-serif, font-display</p>
              </div>
              <div className="p-6 rounded-lg bg-muted/30">
                <p className="font-sans text-2xl mb-2">Inter — Body Text</p>
                <p className="text-sm text-muted-foreground">ტექსტისთვის — font-sans (ნაგულისხმევი)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Type Scale</CardTitle>
              <CardDescription>4-Point Grid Line Heights — ყველა line-height არის 4-ის ჯერადი</CardDescription>
            </CardHeader>
            <CardContent>
              <TypographyExample className="text-9xl font-serif" label="Display XXL" size="8rem" lineHeight="8rem (128px)" />
              <TypographyExample className="text-8xl font-serif" label="Display XL" size="6rem" lineHeight="6rem (96px)" />
              <TypographyExample className="text-7xl font-serif" label="Display" size="4.5rem" lineHeight="4.5rem (72px)" />
              <TypographyExample className="text-6xl font-serif" label="Hero Title" size="3.75rem" lineHeight="3.75rem (60px)" />
              <TypographyExample className="text-5xl font-serif" label="H1" size="3rem" lineHeight="3rem (48px)" />
              <TypographyExample className="text-4xl font-serif" label="H2" size="2.25rem" lineHeight="2.5rem (40px)" />
              <TypographyExample className="text-3xl font-serif" label="H3" size="1.875rem" lineHeight="2.25rem (36px)" />
              <TypographyExample className="text-2xl" label="H4" size="1.5rem" lineHeight="2rem (32px)" />
              <TypographyExample className="text-xl" label="Subtitle" size="1.25rem" lineHeight="1.75rem (28px)" />
              <TypographyExample className="text-lg" label="Lead" size="1.125rem" lineHeight="1.75rem (28px)" />
              <TypographyExample className="text-base" label="Body" size="1rem" lineHeight="1.5rem (24px)" />
              <TypographyExample className="text-sm" label="Small" size="0.875rem" lineHeight="1.25rem (20px)" />
              <TypographyExample className="text-xs" label="Caption" size="0.75rem" lineHeight="1rem (16px)" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Line Heights (Leading)</CardTitle>
              <CardDescription>ვერტიკალური რიტმისთვის — 4-ის ჯერადი მნიშვნელობები</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Semantic Leading</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <code>leading-none</code>
                      <span>1</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <code>leading-tight</code>
                      <span>1.25</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <code>leading-snug</code>
                      <span>1.375</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <code>leading-normal</code>
                      <span>1.5 ★</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <code>leading-relaxed</code>
                      <span>1.625</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <code>leading-loose</code>
                      <span>2</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Fixed Leading (4-Point)</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <code>leading-4</code>
                      <span>1rem (16px)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <code>leading-5</code>
                      <span>1.25rem (20px)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <code>leading-6</code>
                      <span>1.5rem (24px) ★</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <code>leading-7</code>
                      <span>1.75rem (28px)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <code>leading-8</code>
                      <span>2rem (32px) ★</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <code>leading-10</code>
                      <span>2.5rem (40px)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spacing Tab */}
        <TabsContent value="spacing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>4-Point Grid Spacing Scale</CardTitle>
              <CardDescription>
                ყველა spacing მნიშვნელობა უნდა იყოს 4-ის ჯერადი (4px, 8px, 12px, 16px...)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <SpacingBox size="0.5" value="0.125rem" pixels="2px" />
                <SpacingBox size="1" value="0.25rem" pixels="4px" />
                <SpacingBox size="1.5" value="0.375rem" pixels="6px" />
                <SpacingBox size="2" value="0.5rem" pixels="8px" />
                <SpacingBox size="3" value="0.75rem" pixels="12px" />
                <SpacingBox size="4" value="1rem" pixels="16px ★" />
                <SpacingBox size="5" value="1.25rem" pixels="20px" />
                <SpacingBox size="6" value="1.5rem" pixels="24px" />
                <SpacingBox size="8" value="2rem" pixels="32px" />
                <SpacingBox size="10" value="2.5rem" pixels="40px" />
                <SpacingBox size="12" value="3rem" pixels="48px" />
                <SpacingBox size="16" value="4rem" pixels="64px" />
                <SpacingBox size="20" value="5rem" pixels="80px ★" />
                <SpacingBox size="24" value="6rem" pixels="96px" />
                <SpacingBox size="32" value="8rem" pixels="128px ★" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Component Spacing Patterns</CardTitle>
              <CardDescription>ხშირად გამოყენებული spacing კომბინაციები</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Buttons</h4>
                  <div className="flex flex-wrap gap-4">
                    <Button size="sm">px-3 py-1.5</Button>
                    <Button>px-4 py-2</Button>
                    <Button size="lg">px-6 py-3</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Cards</h4>
                  <div className="p-6 border border-border rounded-lg bg-card">
                    <p className="text-sm text-muted-foreground">p-6 (24px)</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Sections</h4>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <code className="text-xs">py-16 md:py-20 lg:py-24</code>
                    <p className="text-sm text-muted-foreground mt-2">64px → 80px → 96px</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Container</h4>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <code className="text-xs">px-4 md:px-6 lg:px-8</code>
                    <p className="text-sm text-muted-foreground mt-2">16px → 24px → 32px</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gap Values</CardTitle>
              <CardDescription>Flexbox და Grid gap-ები</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">gap-2 (8px)</p>
                  <div className="flex gap-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-12 w-12 rounded bg-primary/20" />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3">gap-4 (16px)</p>
                  <div className="flex gap-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-12 w-12 rounded bg-primary/40" />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3">gap-6 (24px)</p>
                  <div className="flex gap-6">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-12 w-12 rounded bg-primary/60" />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3">gap-8 (32px)</p>
                  <div className="flex gap-8">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-12 w-12 rounded bg-primary/80" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>ყველა ღილაკის ვარიანტი</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Copy className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>სტატუსის მაჩვენებლები</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
              <CardDescription>კარტების სტილები</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Default Card</CardTitle>
                    <CardDescription>bg-card, border-border</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">კარტის კონტენტი</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary text-primary-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg">Primary Card</CardTitle>
                    <CardDescription className="text-primary-foreground/70">bg-primary</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">კარტის კონტენტი</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Muted Card</CardTitle>
                    <CardDescription>bg-muted</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">კარტის კონტენტი</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shadows</CardTitle>
              <CardDescription>Premium shadows სიღრმისთვის</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="h-24 rounded-lg bg-card shadow-soft flex items-center justify-center">
                  <span className="text-sm">shadow-soft</span>
                </div>
                <div className="h-24 rounded-lg bg-card shadow-medium flex items-center justify-center">
                  <span className="text-sm">shadow-medium</span>
                </div>
                <div className="h-24 rounded-lg bg-card shadow-luxury flex items-center justify-center">
                  <span className="text-sm">shadow-luxury</span>
                </div>
                <div className="h-24 rounded-lg bg-card shadow-gold flex items-center justify-center">
                  <span className="text-sm">shadow-gold</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guidelines Tab */}
        <TabsContent value="guidelines" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">✅ DO — სწორი პრაქტიკა</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <code className="text-sm">className="p-4 m-8 gap-6"</code>
                  <p className="text-sm text-muted-foreground mt-2">გამოიყენეთ Tailwind spacing კლასები</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <code className="text-sm">className="bg-primary text-foreground"</code>
                  <p className="text-sm text-muted-foreground mt-2">გამოიყენეთ სემანტიკური ფერები</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <code className="text-sm">4, 8, 12, 16, 20, 24, 32, 40, 48...</code>
                  <p className="text-sm text-muted-foreground mt-2">დაიცავით 4-Point Grid</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <code className="text-sm">leading-6, leading-8</code>
                  <p className="text-sm text-muted-foreground mt-2">Line-height ყოველთვის 4-ის ჯერადი</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">❌ DON'T — არასწორი პრაქტიკა</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <code className="text-sm line-through">style="margin: 13px"</code>
                  <p className="text-sm text-muted-foreground mt-2">არ გამოიყენოთ inline px მნიშვნელობები</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <code className="text-sm line-through">className="w-[15px] p-[7px]"</code>
                  <p className="text-sm text-muted-foreground mt-2">არ გამოიყენოთ arbitrary values</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <code className="text-sm line-through">className="text-white bg-blue-500"</code>
                  <p className="text-sm text-muted-foreground mt-2">არ გამოიყენოთ პირდაპირი ფერები</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <code className="text-sm line-through">5px, 13px, 17px, 23px</code>
                  <p className="text-sm text-muted-foreground mt-2">არ გატეხოთ 4-Point Grid</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responsive Breakpoints</CardTitle>
              <CardDescription>მობილურიდან დესკტოპამდე</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <code>sm:</code>
                  <span>≥640px — მობილური (landscape)</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <code>md:</code>
                  <span>≥768px — ტაბლეტი</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <code>lg:</code>
                  <span>≥1024px — ლეპტოპი</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <code>xl:</code>
                  <span>≥1280px — დესკტოპი</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <code>2xl:</code>
                  <span>≥1536px — დიდი ეკრანი</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
