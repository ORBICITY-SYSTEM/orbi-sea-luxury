import { createContext, useContext, useState, ReactNode } from 'react';
import { BookingModal } from '@/components/BookingModal';

interface BookingContextType {
  openBookingModal: (apartmentType?: string) => void;
  closeBookingModal: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedApartment, setPreselectedApartment] = useState<string | undefined>();

  const openBookingModal = (apartmentType?: string) => {
    setPreselectedApartment(apartmentType);
    setIsOpen(true);
  };

  const closeBookingModal = () => {
    setIsOpen(false);
    setPreselectedApartment(undefined);
  };

  return (
    <BookingContext.Provider value={{ openBookingModal, closeBookingModal }}>
      {children}
      <BookingModal
        isOpen={isOpen}
        onClose={closeBookingModal}
        preselectedApartment={preselectedApartment}
      />
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};