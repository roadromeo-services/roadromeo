import BajajLogo from '@/assets/bikes/bajaj.svg';
import HeroLogo from '@/assets/bikes/hero.svg';
import HondaLogo from '@/assets/bikes/honda.svg';
import TvsLogo from '@/assets/bikes/tvs.svg';
import YamahaLogo from '@/assets/bikes/yamaha.svg';
import RoyalEnfieldLogo from '@/assets/bikes/royalenfield.svg';
import KtmLogo from '@/assets/bikes/ktm.svg';
import SuzukiLogo from '@/assets/bikes/suzuki.svg';
import VespaLogo from '@/assets/bikes/vespa.svg';
import KawasakiLogo from '@/assets/bikes/kawasaki.svg';
import TriumphLogo from '@/assets/bikes/triumph.svg';
import BmwLogo from '@/assets/bikes/bmw.svg';

export interface BikeBrand {
  id: string;
  name: string;
  logo?: any;
  models: string[];
}

export const bikeBrands: BikeBrand[] = [
  {
    id: 'hero',
    name: 'Hero',
    logo: HeroLogo,
    models: ['Splendor Plus', 'HF Deluxe', 'Passion Pro', 'Glamour', 'Xtreme 160R', 'Xpulse 200', 'XPulse 210'],
  },
  {
    id: 'honda',
    name: 'Honda',
    logo: HondaLogo,
    models: ['Activa 6G', 'Shine', 'Unicorn', 'SP 125', 'Hornet 2.0', 'CB350', 'Dio'],
  },
  {
    id: 'bajaj',
    name: 'Bajaj',
    logo: BajajLogo,
    models: ['Pulsar 150', 'Pulsar NS200', 'Pulsar RS200', 'Dominar 400', 'Platina', 'CT100'],
  },
  {
    id: 'tvs',
    name: 'TVS',
    logo: TvsLogo,
    models: ['Apache RTR 160', 'Apache RTR 200', 'Jupiter', 'Ntorq', 'Raider', 'Star City'],
  },
  {
    id: 'yamaha',
    name: 'Yamaha',
    logo: YamahaLogo,
    models: ['FZ-S', 'MT-15', 'R15 V4', 'Fascino', 'Ray ZR', 'FZ-X'],
  },
  {
    id: 'royal-enfield',
    name: 'Royal Enfield',
    logo: RoyalEnfieldLogo,
    models: ['Classic 350', 'Bullet 350', 'Meteor 350', 'Hunter 350', 'Himalayan', 'Continental GT'],
  },
  {
    id: 'ktm',
    name: 'KTM',
    logo: KtmLogo,
    models: ['Duke 200', 'Duke 390', 'RC 200', 'RC 390', 'Adventure 390'],
  },
  {
    id: 'suzuki',
    name: 'Suzuki',
    logo: SuzukiLogo,
    models: ['Access 125', 'Gixxer 150', 'Gixxer SF', 'Burgman', 'Avenis'],
  },
  {
    id: 'vespa',
    name: 'Vespa',
    logo: VespaLogo,
    models: ['VXL 125', 'SXL 150', 'Elegante', 'ZX 125'],
  },
  {
    id: 'kawasaki',
    name: 'Kawasaki',
    logo: KawasakiLogo,
    models: ['Ninja 300', 'Ninja 650', 'Z650', 'Versys 650'],
  },
  {
    id: 'triumph',
    name: 'Triumph',
    logo: TriumphLogo,
    models: ['Street Triple', 'Speed 400', 'Tiger Sport'],
  },
  {
    id: 'bmw',
    name: 'BMW',
    logo: BmwLogo,
    models: ['G310R', 'G310GS', 'S1000RR'],
  },
];


export const getBrandById = (id: string) => bikeBrands.find(b => b.id === id);
export const getModelsByBrand = (brandId: string) => getBrandById(brandId)?.models || [];
