import type { Restaurant } from '@/types';

export const mockRestaurants: Restaurant[] = [
  {
    id: 'res_gultik',
    name: 'Gultik Mahakam Blok M',
    category: 'Street Food',
    description: 'Gule Tikungan gurih & sambal mantap',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBgyf-rG9XINqPabUQwLbc8Gdu1aTZIvlrBMFXx1k8XZOIuO4pkTI-INL0xc0FGa9gVOsA2wt82JduFtzkibOvq47DNUbCZq42cEhA_q4N3tK9cpvdEtPBUZLddYEvjyvC5QkpJ1N2C6-BirC2zGmv2aqD-zwk2NkYlsQGfKnGNKKHUt6Jvs2Honlw8v5eaGNLxuIweMh9CO23w7HyQeFC3RNDG2Y7p5aUU8DJnT2QMkkYYSPDuQEVL',
    rating: 4.8,
    price: { min: 20000, max: 35000 },
    distanceKm: 1.2,
  },
  {
    id: 'res_bakmi',
    name: 'Bakmi Gondangdia 1968',
    category: 'Noodles',
    description: 'Legendaris kenyal dengan kuah kaldu murni',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCuo6M5ivnvvMBmExuDfXahGannFy4-mwAmRXaNREo7nwq4e4VXbmvgkDMNys2mj9GJKRA1ekHg60TbdJ6PQ7V6k18T22mbcBDUqRCAmhD91MnxFZE4V7mxMJJwhxoUOIUly405aeOqJJqYBubMHnRbczSzGHtM1WlugsVMFruErG54IYmV7ENTat_hIS-rRI-kCI0tsTBtvg6Re-j6RZEdy55m-K9-tcp_WIu1croTUHP2OySaNvKl',
    rating: 4.7,
    price: { min: 35000, max: 60000 },
    distanceKm: 0.9,
  },
  {
    id: 'res_sate_senayan',
    name: 'Sate Khas Senayan',
    category: 'Sate & Street Food',
    description: 'Sate ayam madura dengan bumbu kacang legendaris',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBgyf-rG9XINqPabUQwLbc8Gdu1aTZIvlrBMFXx1k8XZOIuO4pkTI-INL0xc0FGa9gVOsA2wt82JduFtzkibOvq47DNUbCZq42cEhA_q4N3tK9cpvdEtPBUZLddYEvjyvC5QkpJ1N2C6-BirC2zGmv2aqD-zwk2NkYlsQGfKnGNKKHUt6Jvs2Honlw8v5eaGNLxuIweMh9CO23w7HyQeFC3RNDG2Y7p5aUU8DJnT2QMkkYYSPDuQEVL',
    rating: 4.8,
    price: { min: 45000, max: 90000 },
    distanceKm: 0.85,
    address: 'Jl. HOS Cokroaminoto No.78, Menteng',
    closesAt: '22:00',
    topPick: true,
    budgetTier: 'pas',
  },
];
