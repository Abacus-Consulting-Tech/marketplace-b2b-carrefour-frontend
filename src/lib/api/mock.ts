// Mock authentication for development/testing
// Enable by setting NEXT_PUBLIC_MOCK_AUTH=true in .env.local

import type { Order } from '@/types';

interface MockUser {
  email: string;
  password: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "franchisee" | "supplier" | "admin";
    phone: string;
    status: "active";
    createdAt: string;
    updatedAt: string;
  };
}

// Mock users database
const MOCK_USERS: MockUser[] = [
  {
    email: "admin@test.com",
    password: "admin123",
    user: {
      id: "1",
      email: "admin@test.com",
      name: "Admin Carrefour",
      role: "admin",
      phone: "+34 900 000 001",
      status: "active",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  },
  {
    email: "franchisee@test.com",
    password: "franchisee123",
    user: {
      id: "2",
      email: "franchisee@test.com",
      name: "Juan Pérez",
      role: "franchisee",
      phone: "+34 900 000 002",
      status: "active",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  },
  {
    email: "supplier@test.com",
    password: "supplier123",
    user: {
      id: "3",
      email: "supplier@test.com",
      name: "María García",
      role: "supplier",
      phone: "+34 900 000 003",
      status: "active",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  },
];

// Mock products database
const MOCK_PRODUCTS = [
  // Uniformes
  {
    id: "1",
    name: "Polo Corporativo Carrefour",
    description: "Polo manga corta con bordado corporativo, tejido transpirable 100% algodón piqué",
    sku: "UNI-001",
    categoryId: "1",
    supplierId: "3",
    price: 18.50,
    currency: "EUR",
    stock: 500,
    images: ["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400"],
    rating: 4.7,
    reviewCount: 42,
    specifications: { material: "100% algodón piqué", tallas: "XS–3XL", colores: "Azul corporativo, Blanco" },
    category: "Uniformes",
    supplier: { id: "3", name: "Uniformes Corporativos S.L." },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Chaqueta de Trabajo Unisex",
    description: "Chaqueta con bolsillos laterales y logo bordado, tejido resistente antiestático",
    sku: "UNI-002",
    categoryId: "1",
    supplierId: "3",
    price: 45.00,
    currency: "EUR",
    stock: 200,
    images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400"],
    rating: 4.8,
    reviewCount: 31,
    specifications: { material: "65% poliéster, 35% algodón", tallas: "XS–3XL", colores: "Azul marino" },
    category: "Uniformes",
    supplier: { id: "3", name: "Uniformes Corporativos S.L." },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Delantal de Trabajo",
    description: "Delantal ajustable con bolsillo central y refuerzo en rodillas, fácil limpieza",
    sku: "UNI-003",
    categoryId: "1",
    supplierId: "3",
    price: 12.90,
    currency: "EUR",
    stock: 350,
    images: ["https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400"],
    rating: 4.5,
    reviewCount: 28,
    specifications: { material: "Poliéster reforzado", talla: "Única ajustable", colores: "Azul / Rojo" },
    category: "Uniformes",
    supplier: { id: "3", name: "Uniformes Corporativos S.L." },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  // Folletos
  {
    id: "4",
    name: "Folleto Promocional A5 (Pack 1.000 uds)",
    description: "Impresión a todo color en papel couché 135g, acabado satinado, doble cara",
    sku: "FOL-001",
    categoryId: "2",
    supplierId: "3",
    price: 89.00,
    currency: "EUR",
    stock: 120,
    images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400"],
    rating: 4.6,
    reviewCount: 19,
    specifications: { formato: "A5 (148×210mm)", papel: "Couché 135g satinado", cantidad: "1.000 unidades", caras: "Doble cara" },
    category: "Folletos",
    supplier: { id: "3", name: "Imprenta Corporativa S.L." },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "5",
    name: "Catálogo de Productos A4 (Pack 500 uds)",
    description: "Catálogo grapado 8 páginas, impresión offset a todo color, portada plastificada brillo",
    sku: "FOL-002",
    categoryId: "2",
    supplierId: "3",
    price: 210.00,
    currency: "EUR",
    stock: 60,
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"],
    rating: 4.7,
    reviewCount: 14,
    specifications: { formato: "A4 (210×297mm)", páginas: "8 páginas grapadas", papel: "Couché 150g", cantidad: "500 unidades" },
    category: "Folletos",
    supplier: { id: "3", name: "Imprenta Corporativa S.L." },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  // Señalización en tienda
  {
    id: "6",
    name: "Cartel de Precios PVC (Pack 10 uds)",
    description: "Cartel rígido de PVC expandido 5mm con impresión UV, bordes redondeados",
    sku: "SEÑ-001",
    categoryId: "3",
    supplierId: "3",
    price: 55.00,
    currency: "EUR",
    stock: 80,
    images: ["https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400"],
    rating: 4.6,
    reviewCount: 22,
    specifications: { material: "PVC expandido 5mm", formato: "A4 (210×297mm)", acabado: "Impresión UV mate", cantidad: "10 unidades" },
    category: "Señalización en tienda",
    supplier: { id: "3", name: "Visual Retail S.L." },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "7",
    name: "Vinilo Adhesivo para Suelo",
    description: "Vinilo antideslizante para suelo con laminado protector, fácil instalación y retirada",
    sku: "SEÑ-002",
    categoryId: "3",
    supplierId: "3",
    price: 38.00,
    currency: "EUR",
    stock: 150,
    images: ["https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400"],
    rating: 4.5,
    reviewCount: 17,
    specifications: { material: "Vinilo antideslizante laminado", tamaño: "60×60 cm", instalación: "Autoadhesivo" },
    category: "Señalización en tienda",
    supplier: { id: "3", name: "Visual Retail S.L." },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "8",
    name: "Tótem Expositivo de Pie",
    description: "Tótem de aluminio con pantalla de aluminio y soporte para impresión intercambiable, altura 180cm",
    sku: "SEÑ-003",
    categoryId: "3",
    supplierId: "3",
    price: 125.00,
    currency: "EUR",
    stock: 40,
    images: ["https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400"],
    rating: 4.8,
    reviewCount: 11,
    specifications: { material: "Aluminio anodizado", altura: "180 cm", formato_gráfico: "60×160 cm", montaje: "Incluido" },
    category: "Señalización en tienda",
    supplier: { id: "3", name: "Visual Retail S.L." },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  // Equipamientos
  {
    id: "9",
    name: "Balanza Digital de Mostrador",
    description: "Balanza electrónica con pantalla LCD, precisión 1g, capacidad 30kg, homologada CE",
    sku: "EQU-001",
    categoryId: "4",
    supplierId: "3",
    price: 189.00,
    currency: "EUR",
    stock: 35,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    rating: 4.7,
    reviewCount: 26,
    specifications: { capacidad: "30 kg", precisión: "1 g", pantalla: "LCD retroiluminada", homologación: "CE" },
    category: "Equipamientos",
    supplier: { id: "3", name: "Equipamiento Retail Pro" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "10",
    name: "Expositor Metálico Giratorio 4 Caras",
    description: "Expositor de góndola giratorio en acero lacado, 4 caras con 5 bandejas ajustables por cara",
    sku: "EQU-002",
    categoryId: "4",
    supplierId: "3",
    price: 320.00,
    currency: "EUR",
    stock: 20,
    images: ["https://images.unsplash.com/photo-1606166325683-e6deb697d301?w=400"],
    rating: 4.6,
    reviewCount: 13,
    specifications: { material: "Acero lacado blanco", caras: "4", bandejas_por_cara: "5 ajustables", altura: "165 cm" },
    category: "Equipamientos",
    supplier: { id: "3", name: "Equipamiento Retail Pro" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "11",
    name: "Carro de Transporte Plegable",
    description: "Carro de almacén plegable con ruedas de goma, carga máxima 150kg, estructura de acero galvanizado",
    sku: "EQU-003",
    categoryId: "4",
    supplierId: "3",
    price: 74.00,
    currency: "EUR",
    stock: 9,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"],
    rating: 4.5,
    reviewCount: 20,
    specifications: { material: "Acero galvanizado", carga_máxima: "150 kg", ruedas: "Goma antiarañazos", plegable: "Sí" },
    category: "Equipamientos",
    supplier: { id: "3", name: "Equipamiento Retail Pro" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  // Merchandising
  {
    id: "12",
    name: "Bolsa Reutilizable Carrefour (Pack 100 uds)",
    description: "Bolsa de no-tejido con asa larga, serigrafía a 2 colores con logotipo corporativo",
    sku: "MER-001",
    categoryId: "5",
    supplierId: "3",
    price: 65.00,
    currency: "EUR",
    stock: 300,
    images: ["https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400"],
    rating: 4.7,
    reviewCount: 38,
    specifications: { material: "Non-woven 80g", tamaño: "38×42 cm", impresión: "Serigrafía 2 colores", cantidad: "100 unidades" },
    category: "Merchandising",
    supplier: { id: "3", name: "Promo Gifts S.L." },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "13",
    name: "Bolígrafo Corporativo (Pack 200 uds)",
    description: "Bolígrafo retráctil con clip metálico, tinta azul, tampografía con logotipo en 1 color",
    sku: "MER-002",
    categoryId: "5",
    supplierId: "3",
    price: 48.00,
    currency: "EUR",
    stock: 500,
    images: ["https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400"],
    rating: 4.4,
    reviewCount: 29,
    specifications: { material: "Plástico ABS", tinta: "Azul", impresión: "Tampografía 1 color", cantidad: "200 unidades" },
    category: "Merchandising",
    supplier: { id: "3", name: "Promo Gifts S.L." },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "14",
    name: "Taza Cerámica con Logotipo (Pack 24 uds)",
    description: "Taza cerámica blanca 300ml con impresión digital de alta resolución, apta para lavavajillas",
    sku: "MER-003",
    categoryId: "5",
    supplierId: "3",
    price: 96.00,
    currency: "EUR",
    stock: 150,
    images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400"],
    rating: 4.8,
    reviewCount: 21,
    specifications: { material: "Cerámica", capacidad: "300 ml", impresión: "Digital 4 colores", cantidad: "24 unidades", lavavajillas: "Sí" },
    category: "Merchandising",
    supplier: { id: "3", name: "Promo Gifts S.L." },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

// Mock suppliers database
const MOCK_SUPPLIERS = [
  {
    id: "1",
    companyName: "Aceites del Sur S.L.",
    legalName: "Aceites del Sur Sociedad Limitada",
    cif: "B12345678",
    email: "info@aceitesdelsur.com",
    phone: "+34 950 123 456",
    address: "Polígono Industrial Las Salinas, Nave 5",
    city: "Almería",
    province: "Almería",
    postalCode: "04006",
    country: "España",
    status: "approved" as const,
    contactPerson: {
      name: "María González",
      email: "maria@aceitesdelsur.com",
      phone: "+34 950 123 457",
    },
    taxId: "B12345678",
    productCategories: ["Uniformes", "Merchandising"],
    website: "https://aceitesdelsur.com",
    description: "Productores de aceite de oliva virgen extra desde 1985. Certificación ecológica.",
    rating: 4.8,
    totalProducts: 12,
    totalOrders: 245,
    createdAt: "2023-06-15T10:00:00.000Z",
    updatedAt: "2024-01-10T15:30:00.000Z",
    approvedAt: "2023-06-20T09:00:00.000Z",
    approvedBy: "1",
  },
  {
    id: "2",
    companyName: "Ibéricos Premium S.A.",
    legalName: "Ibéricos Premium Sociedad Anónima",
    cif: "A87654321",
    email: "contacto@ibericospremium.com",
    phone: "+34 924 654 321",
    address: "Finca La Dehesa, Km 23",
    city: "Badajoz",
    province: "Badajoz",
    postalCode: "06001",
    country: "España",
    status: "approved" as const,
    contactPerson: {
      name: "Carlos Martínez",
      email: "carlos@ibericospremium.com",
      phone: "+34 924 654 322",
    },
    taxId: "A87654321",
    productCategories: ["Folletos", "Señalización en tienda"],
    website: "https://ibericospremium.com",
    description: "Jamones y embutidos ibéricos de bellota. D.O. Dehesa de Extremadura.",
    rating: 4.9,
    totalProducts: 24,
    totalOrders: 389,
    createdAt: "2023-05-10T08:00:00.000Z",
    updatedAt: "2024-01-15T11:20:00.000Z",
    approvedAt: "2023-05-15T10:30:00.000Z",
    approvedBy: "1",
  },
  {
    id: "3",
    companyName: "Bodegas del Valle",
    legalName: "Bodegas del Valle S.L.",
    cif: "B45678912",
    email: "ventas@bodegasdelvalle.com",
    phone: "+34 941 555 789",
    address: "Carretera de Logroño, Km 5",
    city: "Haro",
    province: "La Rioja",
    postalCode: "26200",
    country: "España",
    status: "approved" as const,
    contactPerson: {
      name: "Ana Ruiz",
      email: "ana@bodegasdelvalle.com",
      phone: "+34 941 555 790",
    },
    taxId: "B45678912",
    productCategories: ["Equipamientos", "Señalización en tienda"],
    website: "https://bodegasdelvalle.com",
    description: "Vinos D.O. Rioja con más de 100 años de tradición familiar.",
    rating: 4.7,
    totalProducts: 18,
    totalOrders: 312,
    createdAt: "2023-07-01T12:00:00.000Z",
    updatedAt: "2024-01-12T16:45:00.000Z",
    approvedAt: "2023-07-10T14:00:00.000Z",
    approvedBy: "1",
  },
  {
    id: "4",
    companyName: "Fresh Produce Andalucía",
    legalName: "Fresh Produce Andalucía S.L.",
    cif: "B98765432",
    email: "info@freshproduce.es",
    phone: "+34 955 321 654",
    address: "Mercado Central, Nave 12",
    city: "Sevilla",
    province: "Sevilla",
    postalCode: "41001",
    country: "España",
    status: "pending" as const,
    contactPerson: {
      name: "Pedro López",
      email: "pedro@freshproduce.es",
      phone: "+34 955 321 655",
    },
    taxId: "B98765432",
    productCategories: ["Folletos", "Merchandising"],
    website: "https://freshproduce.es",
    description: "Distribución de frutas y verduras frescas. Producto local y de temporada.",
    totalProducts: 0,
    totalOrders: 0,
    createdAt: "2024-01-20T09:30:00.000Z",
    updatedAt: "2024-01-20T09:30:00.000Z",
  },
  {
    id: "5",
    companyName: "Lácteos La Granja",
    legalName: "Lácteos La Granja S.A.",
    cif: "A11223344",
    email: "ventas@lacteoslagranja.com",
    phone: "+34 987 456 123",
    address: "Polígono Ganadero, Parcela 15",
    city: "León",
    province: "León",
    postalCode: "24001",
    country: "España",
    status: "rejected" as const,
    contactPerson: {
      name: "Laura Fernández",
      email: "laura@lacteoslagranja.com",
      phone: "+34 987 456 124",
    },
    taxId: "A11223344",
    productCategories: ["Uniformes", "Equipamientos"],
    description: "Productos lácteos artesanales.",
    totalProducts: 0,
    totalOrders: 0,
    createdAt: "2024-01-05T11:00:00.000Z",
    updatedAt: "2024-01-08T14:20:00.000Z",
    rejectedReason: "Documentación incompleta. Falta certificado sanitario.",
  },
  {
    id: "6",
    companyName: "Distribuciones MarySol",
    legalName: "Distribuciones MarySol S.L.",
    cif: "B55443322",
    email: "admin@marysol.com",
    phone: "+34 958 741 852",
    address: "Calle Comercio, 45",
    city: "Granada",
    province: "Granada",
    postalCode: "18001",
    country: "España",
    status: "suspended" as const,
    contactPerson: {
      name: "Sofía Ramírez",
      email: "sofia@marysol.com",
      phone: "+34 958 741 853",
    },
    taxId: "B55443322",
    productCategories: ["Merchandising", "Folletos"],
    website: "https://marysol.com",
    description: "Distribuidor mayorista de productos alimentarios.",
    rating: 3.5,
    totalProducts: 8,
    totalOrders: 45,
    createdAt: "2023-11-01T10:00:00.000Z",
    updatedAt: "2024-01-18T17:00:00.000Z",
    approvedAt: "2023-11-05T12:00:00.000Z",
    approvedBy: "1",
  },
];

// Mock orders database
const MOCK_ORDERS = [
  {
    id: "1",
    orderNumber: "CF-10001",
    franchiseeId: "2",
    franchiseeName: "Juan Pérez",
    status: "delivered" as const,
    items: [
      {
        id: "1",
        productId: "1",
        productName: "Polo Corporativo Carrefour",
        productImage: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
        supplierId: "3",
        supplierName: "Uniformes Corporativos S.L.",
        quantity: 20,
        unitPrice: 18.50,
        subtotal: 370.00,
        tax: 77.70,
      },
      {
        id: "2",
        productId: "6",
        productName: "Cartel de Precios PVC (Pack 10 uds)",
        productImage: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400",
        supplierId: "3",
        supplierName: "Visual Retail S.L.",
        quantity: 3,
        unitPrice: 55.00,
        subtotal: 165.00,
        tax: 34.65,
      },
    ],
    subtotal: 535.00,
    tax: 112.35,
    shippingCost: 0,
    total: 647.35,
    currency: "EUR",
    shippingAddress: {
      fullName: "Juan Pérez",
      phone: "+34 666 123 456",
      address: "Calle Mayor 123, 2º A",
      city: "Madrid",
      province: "Madrid",
      postalCode: "28001",
      country: "España",
    },
    paymentMethod: "tarjeta" as const,
    paymentStatus: "paid" as const,
    trackingNumber: "ES1234567890123456",
    estimatedDelivery: "2024-01-20",
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-18T14:20:00.000Z",
    deliveredAt: "2024-01-18T14:20:00.000Z",
  },
  {
    id: "2",
    orderNumber: "CF-10002",
    franchiseeId: "2",
    franchiseeName: "Juan Pérez",
    status: "shipped" as const,
    items: [
      {
        id: "3",
        productId: "12",
        productName: "Bolsa Reutilizable Carrefour (Pack 100 uds)",
        productImage: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400",
        supplierId: "3",
        supplierName: "Promo Gifts S.L.",
        quantity: 5,
        unitPrice: 65.00,
        subtotal: 325.00,
        tax: 68.25,
      },
    ],
    subtotal: 325.00,
    tax: 68.25,
    shippingCost: 0,
    total: 393.25,
    currency: "EUR",
    shippingAddress: {
      fullName: "Juan Pérez",
      phone: "+34 666 123 456",
      address: "Calle Mayor 123, 2º A",
      city: "Madrid",
      province: "Madrid",
      postalCode: "28001",
      country: "España",
    },
    paymentMethod: "tarjeta" as const,
    paymentStatus: "paid" as const,
    trackingNumber: "ES9876543210987654",
    estimatedDelivery: "2024-01-25",
    createdAt: "2024-01-20T09:15:00.000Z",
    updatedAt: "2024-01-22T16:45:00.000Z",
  },
];

// Mock API delay
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to manage orders in localStorage
const getStoredOrders = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('mock-orders');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveStoredOrders = (orders: Order[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('mock-orders', JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders to localStorage:', e);
  }
};

export const mockApi = {
  // Check if mock mode is enabled
  isMockMode: () => {
    return process.env.NEXT_PUBLIC_MOCK_AUTH === "true";
  },

  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      await delay();
      
      const mockUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!mockUser) {
        throw new Error("Credenciales inválidas");
      }

      return {
        data: {
          token: `mock-token-${mockUser.user.id}-${Date.now()}`,
          user: mockUser.user,
        },
      };
    },

    register: async (data: { email: string; name: string; role: string; company?: string; phone?: string }) => {
      await delay();
      
      // Check if email already exists
      if (MOCK_USERS.some((u) => u.email === data.email)) {
        throw new Error("El email ya está registrado");
      }

      const newUser = {
        id: String(MOCK_USERS.length + 1),
        email: data.email,
        name: data.name,
        role: data.role,
        phone: data.phone,
        status: "active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        data: {
          user: newUser,
          message: "Usuario registrado exitosamente",
        },
      };
    },

    forgotPassword: async (email: string) => {
      await delay();
      
      const user = MOCK_USERS.find((u) => u.email === email);
      if (!user) {
        throw new Error("Email no encontrado");
      }

      return {
        data: {
          message: "Email de recuperación enviado",
        },
      };
    },
  },

  // Products endpoints
  products: {
    list: async () => {
      await delay();
      return {
        data: MOCK_PRODUCTS,
      };
    },

    getById: async (id: string) => {
      await delay();
      const product = MOCK_PRODUCTS.find((p) => p.id === id);
      
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      return {
        data: product,
      };
    },
  },

  // Suppliers endpoints
  suppliers: {
    list: async () => {
      await delay();
      return {
        data: MOCK_SUPPLIERS,
      };
    },

    getById: async (id: string) => {
      await delay();
      const supplier = MOCK_SUPPLIERS.find((s) => s.id === id);
      
      if (!supplier) {
        throw new Error("Proveedor no encontrado");
      }

      return {
        data: supplier,
      };
    },

    approve: async (id: string) => {
      await delay();
      const supplier = MOCK_SUPPLIERS.find((s) => s.id === id);
      
      if (!supplier) {
        throw new Error("Proveedor no encontrado");
      }

      // Update supplier status
      supplier.status = 'approved';
      supplier.approvedAt = new Date().toISOString();
      supplier.approvedBy = "1"; // Admin ID

      return {
        data: supplier,
        message: "Proveedor aprobado exitosamente",
      };
    },

    reject: async (id: string, reason: string) => {
      await delay();
      const supplier = MOCK_SUPPLIERS.find((s) => s.id === id);
      
      if (!supplier) {
        throw new Error("Proveedor no encontrado");
      }

      // Update supplier status
      supplier.status = 'rejected';
      supplier.rejectedReason = reason;
      supplier.updatedAt = new Date().toISOString();

      return {
        data: supplier,
        message: "Proveedor rechazado",
      };
    },

    suspend: async (id: string) => {
      await delay();
      const supplier = MOCK_SUPPLIERS.find((s) => s.id === id);
      
      if (!supplier) {
        throw new Error("Proveedor no encontrado");
      }

      supplier.status = 'suspended';
      supplier.updatedAt = new Date().toISOString();

      return {
        data: supplier,
        message: "Proveedor suspendido",
      };
    },

    activate: async (id: string) => {
      await delay();
      const supplier = MOCK_SUPPLIERS.find((s) => s.id === id);
      
      if (!supplier) {
        throw new Error("Proveedor no encontrado");
      }

      supplier.status = 'approved';
      supplier.updatedAt = new Date().toISOString();

      return {
        data: supplier,
        message: "Proveedor activado",
      };
    },
  },

  // Orders endpoints
  orders: {
    list: async (userId?: string) => {
      await delay();
      // Combinar órdenes mock con las guardadas en localStorage
      const storedOrders = getStoredOrders();
      const allOrders = [...MOCK_ORDERS, ...storedOrders];
      
      // Si se proporciona userId, filtrar órdenes por franquiciado
      const orders = userId 
        ? allOrders.filter(o => o.franchiseeId === userId)
        : allOrders;
      
      return {
        data: orders,
      };
    },

    getById: async (id: string) => {
      await delay();
      const storedOrders = getStoredOrders();
      const allOrders = [...MOCK_ORDERS, ...storedOrders];
      const order = allOrders.find((o) => o.id === id);
      
      if (!order) {
        throw new Error("Pedido no encontrado");
      }

      return {
        data: order,
      };
    },

    create: async (orderData: Partial<Order>) => {
      await delay();
      
      const storedOrders = getStoredOrders();
      const allOrders = [...MOCK_ORDERS, ...storedOrders];
      
      const newOrder = {
        id: String(allOrders.length + 1),
        orderNumber: `CF-${10000 + allOrders.length + 1}`,
        ...orderData,
        status: 'pending' as const,
        paymentStatus: 'paid' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Guardar en localStorage en lugar de array en memoria
      const updatedStoredOrders = [...storedOrders, newOrder];
      saveStoredOrders(updatedStoredOrders);

      return {
        data: newOrder,
        message: "Pedido creado exitosamente",
      };
    },

    cancel: async (id: string) => {
      await delay();
      const storedOrders = getStoredOrders();
      const allOrders = [...MOCK_ORDERS, ...storedOrders];
      const order = allOrders.find((o) => o.id === id);
      
      if (!order) {
        throw new Error("Pedido no encontrado");
      }

      if (order.status === 'delivered' || order.status === 'shipped') {
        throw new Error("No se puede cancelar un pedido que ya ha sido enviado o entregado");
      }

      order.status = 'cancelled';
      order.updatedAt = new Date().toISOString();
      
      // Si es un pedido almacenado, actualizar localStorage
      if (!MOCK_ORDERS.find(o => o.id === id)) {
        const updatedStoredOrders = storedOrders.map((o: Order) => 
          o.id === id ? order : o
        );
        saveStoredOrders(updatedStoredOrders);
      }

      return {
        data: order,
        message: "Pedido cancelado",
      };
    },
  },
};

// Helper to get mock credentials info
export const getMockCredentials = () => {
  return MOCK_USERS.map(({ email, password, user }) => ({
    email,
    password,
    role: user.role,
    name: user.name,
  }));
};
