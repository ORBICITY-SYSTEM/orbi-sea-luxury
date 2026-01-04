import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, ArrowUpDown, Calendar, Tag, CheckCircle2 } from 'lucide-react';

interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
  label: 'feature' | 'fix' | 'improvement' | 'integration' | 'ui' | 'backend';
}

const changelogData: ChangelogEntry[] = [
  {
    date: '2025-01-04',
    title: 'Loyalty Points Redemption',
    description: 'მომხმარებლებს შეუძლიათ ლოიალობის ქულების გამოყენება ფასდაკლებისთვის დაჯავშნისას. 10 ქულა = 1₾, მაქსიმუმ 50% ფასდაკლება.',
    label: 'feature'
  },
  {
    date: '2025-01-04',
    title: 'Registration Success Popup',
    description: 'Confetti ანიმაცია და მილოცვის popup რეგისტრაციის წარმატების შემდეგ 20₾ ბონუსის შეტყობინებით.',
    label: 'ui'
  },
  {
    date: '2025-01-04',
    title: 'Management API Endpoint',
    description: 'API endpoint მენეჯმენტის პროგრამისთვის - აბრუნებს bookings, users და stats მონაცემებს ერთ request-ით.',
    label: 'backend'
  },
  {
    date: '2025-01-04',
    title: 'Google Tag Manager Integration',
    description: 'GTM ინტეგრაცია დინამიური Container ID-ით ადმინ პანელიდან მართვით.',
    label: 'integration'
  },
  {
    date: '2025-01-04',
    title: 'Auto Registration During Booking',
    description: 'არაავტორიზებულ მომხმარებლებს შეუძლიათ რეგისტრაცია დაჯავშნის პროცესში და მიიღონ 20₾ ბონუსი.',
    label: 'feature'
  },
  {
    date: '2025-01-03',
    title: 'Channel Manager',
    description: 'Booking.com, Airbnb და სხვა არხების iCal ინტეგრაცია ავტომატური სინქრონიზაციით.',
    label: 'integration'
  },
  {
    date: '2025-01-03',
    title: 'Reports Dashboard',
    description: 'ანგარიშების გვერდი შემოსავლების, დაჯავშნების და ანალიტიკის სტატისტიკით.',
    label: 'feature'
  },
  {
    date: '2025-01-02',
    title: 'Email Templates',
    description: 'Email შაბლონების მართვა ქართულ და ინგლისურ ენაზე.',
    label: 'feature'
  },
  {
    date: '2025-01-02',
    title: 'Housekeeping Management',
    description: 'ოთახების დასუფთავების სტატუსის მართვა და მინიჭება.',
    label: 'feature'
  },
  {
    date: '2025-01-01',
    title: 'Guest Messaging',
    description: 'სტუმრებთან ჩატის სისტემა დაჯავშნებთან დაკავშირებით.',
    label: 'feature'
  },
  {
    date: '2025-01-01',
    title: 'Blog Comments',
    description: 'ბლოგის კომენტარების სისტემა მოდერაციით.',
    label: 'feature'
  },
  {
    date: '2024-12-30',
    title: 'Blocked Dates Management',
    description: 'თარიღების დაბლოკვის ფუნქცია ბინების მიხედვით.',
    label: 'feature'
  },
  {
    date: '2024-12-30',
    title: 'Seasonal Pricing',
    description: 'სეზონური ფასების მართვა თვეების მიხედვით.',
    label: 'feature'
  },
  {
    date: '2024-12-28',
    title: 'Calendar View',
    description: 'ბრონირებების კალენდარული ხედი ვიზუალური ინტერფეისით.',
    label: 'ui'
  },
  {
    date: '2024-12-28',
    title: 'Pending Reservations',
    description: 'მოლოდინში მყოფი ჯავშნების ცალკე გვერდი სწრაფი დამუშავებისთვის.',
    label: 'feature'
  },
  {
    date: '2024-12-25',
    title: 'A/B Testing',
    description: 'ექსპერიმენტების მართვის სისტემა ვარიანტების ტესტირებისთვის.',
    label: 'feature'
  },
  {
    date: '2024-12-25',
    title: 'Promo Codes',
    description: 'პრომო კოდების შექმნა და მართვა პროცენტული და ფიქსირებული ფასდაკლებით.',
    label: 'feature'
  },
  {
    date: '2024-12-22',
    title: 'Loyalty Program',
    description: 'ლოიალობის პროგრამა ბრინჯაოს, ვერცხლის და ოქროს დონეებით.',
    label: 'feature'
  },
  {
    date: '2024-12-22',
    title: 'User Management',
    description: 'მომხმარებლების მართვა და როლების მინიჭება.',
    label: 'feature'
  },
  {
    date: '2024-12-20',
    title: 'Media Library',
    description: 'მედია ბიბლიოთეკა სურათების და ვიდეოების მართვით.',
    label: 'feature'
  },
  {
    date: '2024-12-20',
    title: 'Content Management',
    description: 'გვერდების კონტენტის დინამიური მართვა.',
    label: 'feature'
  },
  {
    date: '2024-12-18',
    title: 'SEO Management',
    description: 'გვერდების SEO პარამეტრების მართვა.',
    label: 'improvement'
  },
  {
    date: '2024-12-18',
    title: 'Style Guide',
    description: 'დიზაინ სისტემის დოკუმენტაცია და კომპონენტების ბიბლიოთეკა.',
    label: 'ui'
  },
  {
    date: '2024-12-15',
    title: 'Booking System',
    description: 'ონლაინ დაჯავშნის სისტემა ფასების გამოთვლით და გადახდის ინტეგრაციით.',
    label: 'feature'
  },
  {
    date: '2024-12-15',
    title: 'Admin Dashboard',
    description: 'ადმინისტრატორის პანელი სტატისტიკით და მართვის ინსტრუმენტებით.',
    label: 'feature'
  },
  {
    date: '2024-12-10',
    title: 'Multi-language Support',
    description: 'ქართული და ინგლისური ენების მხარდაჭერა i18n-ით.',
    label: 'feature'
  },
  {
    date: '2024-12-10',
    title: 'Authentication System',
    description: 'მომხმარებლების რეგისტრაცია და ავტორიზაცია.',
    label: 'backend'
  },
  {
    date: '2024-12-05',
    title: 'Initial Setup',
    description: 'პროექტის საწყისი აწყობა React, Vite, TailwindCSS და Supabase-ით.',
    label: 'backend'
  }
];

const labelConfig = {
  feature: { label: 'ფუნქცია', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  fix: { label: 'გასწორება', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  improvement: { label: 'გაუმჯობესება', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  integration: { label: 'ინტეგრაცია', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  ui: { label: 'UI/UX', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  backend: { label: 'Backend', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' }
};

export function AdminChangelog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [labelFilter, setLabelFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredData = useMemo(() => {
    let result = [...changelogData];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        entry =>
          entry.title.toLowerCase().includes(query) ||
          entry.description.toLowerCase().includes(query)
      );
    }

    // Filter by label
    if (labelFilter !== 'all') {
      result = result.filter(entry => entry.label === labelFilter);
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [searchQuery, labelFilter, sortOrder]);

  const stats = useMemo(() => {
    return {
      total: changelogData.length,
      features: changelogData.filter(e => e.label === 'feature').length,
      integrations: changelogData.filter(e => e.label === 'integration').length,
      ui: changelogData.filter(e => e.label === 'ui').length
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">ცვლილებების ისტორია</h1>
        <p className="text-muted-foreground mt-1">
          პროექტის განვითარების სრული ქრონოლოგია
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">სულ ცვლილება</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Tag className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.features}</p>
                <p className="text-xs text-muted-foreground">ახალი ფუნქცია</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Tag className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.integrations}</p>
                <p className="text-xs text-muted-foreground">ინტეგრაცია</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Tag className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.ui}</p>
                <p className="text-xs text-muted-foreground">UI/UX</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ძებნა..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={labelFilter} onValueChange={setLabelFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Tag className="h-4 w-4 mr-2" />
                <SelectValue placeholder="ლეიბლი" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ყველა ლეიბლი</SelectItem>
                <SelectItem value="feature">ფუნქცია</SelectItem>
                <SelectItem value="fix">გასწორება</SelectItem>
                <SelectItem value="improvement">გაუმჯობესება</SelectItem>
                <SelectItem value="integration">ინტეგრაცია</SelectItem>
                <SelectItem value="ui">UI/UX</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="w-full sm:w-auto"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOrder === 'newest' ? 'უახლესი' : 'უძველესი'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Changelog List */}
      <Card>
        <CardHeader>
          <CardTitle>ცვლილებები ({filteredData.length})</CardTitle>
          <CardDescription>
            თარიღების მიხედვით დალაგებული ცვლილებების სია
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData.map((entry, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0 flex items-center gap-2 text-sm text-muted-foreground min-w-[100px]">
                  <Calendar className="h-4 w-4" />
                  {entry.date}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{entry.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={labelConfig[entry.label].color}
                    >
                      {labelConfig[entry.label].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {entry.description}
                  </p>
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>შედეგები არ მოიძებნა</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
