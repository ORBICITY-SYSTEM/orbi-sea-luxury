import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { format, isBefore, startOfDay } from "date-fns";

interface PriceData {
  [key: string]: number; // Date string (YYYY-MM-DD) -> price
}

type DayPickerProps = React.ComponentProps<typeof DayPicker>;

interface BookingCalendarProps {
  prices?: PriceData;
  basePrice?: number;
  currency?: string;
  className?: string;
  classNames?: DayPickerProps['classNames'];
  showOutsideDays?: boolean;
  mode?: DayPickerProps['mode'];
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  disabled?: DayPickerProps['disabled'];
  initialFocus?: boolean;
}

function BookingCalendar({ 
  className, 
  classNames, 
  showOutsideDays = true,
  prices = {},
  basePrice = 0,
  currency = "₾",
  mode = "single",
  selected,
  onSelect,
  disabled,
  initialFocus,
}: BookingCalendarProps) {
  const today = startOfDay(new Date());

  return (
    <DayPicker
      mode={mode as "single"}
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      initialFocus={initialFocus}
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-12 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-12 w-12 p-0 font-normal aria-selected:opacity-100 flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-primary/20"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground ring-2 ring-primary/50 ring-offset-2 ring-offset-background animate-pulse shadow-lg shadow-primary/30",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        DayContent: ({ date, displayMonth }) => {
          const dateKey = format(date, 'yyyy-MM-dd');
          const price = prices[dateKey] || basePrice;
          const isPast = isBefore(date, today);
          const isOutside = date.getMonth() !== displayMonth.getMonth();
          const hasPrice = price > 0 && !isPast && !isOutside;
          
          return (
            <div 
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-full h-full rounded-md transition-all duration-300",
                hasPrice && "bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 hover:from-primary/20 hover:via-primary/10 hover:to-accent/20 shadow-sm"
              )}
            >
              <span className={cn(
                "font-medium",
                hasPrice && "text-primary"
              )}>{date.getDate()}</span>
              {hasPrice && (
                <span className="text-[9px] font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-none">
                  {currency}{price}
                </span>
              )}
            </div>
          );
        },
      }}
    />
  );
}

BookingCalendar.displayName = "BookingCalendar";

export { BookingCalendar };
export type { PriceData };