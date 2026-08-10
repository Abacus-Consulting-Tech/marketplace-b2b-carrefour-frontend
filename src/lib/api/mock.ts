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
    email: "admin@carrefour.com",
    password: "admin123",
    user: {
      id: "1",
      email: "admin@carrefour.com",
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
  {
    id: "1",
    name: "Aceite de Oliva Virgen Extra",
    description: "Aceite de oliva virgen extra de primera calidad, cosecha 2024",
    sku: "AOL-001",
    categoryId: "1",
    supplierId: "3",
    price: 12.99,
    currency: "EUR",
    stock: 150,
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400"],
    rating: 4.8,
    reviewCount: 24,
    specifications: { volume: "1L", origin: "España" },
    category: "Alimentación",
    supplier: { id: "3", name: "Aceites del Sur" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Jamón Ibérico",
    description: "Jamón ibérico de bellota, curado 36 meses",
    sku: "JAM-002",
    categoryId: "1",
    supplierId: "3",
    price: 89.99,
    currency: "EUR",
    stock: 45,
    images: ["https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400"],
    rating: 4.9,
    reviewCount: 18,
    specifications: { weight: "1kg", origin: "España" },
    category: "Alimentación",
    supplier: { id: "3", name: "Ibéricos Premium" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Vino Tinto Reserva",
    description: "Vino tinto reserva D.O. Rioja, cosecha 2019",
    sku: "VIN-003",
    categoryId: "2",
    supplierId: "3",
    price: 24.50,
    currency: "EUR",
    stock: 80,
    images: ["https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400"],
    rating: 4.7,
    reviewCount: 32,
    specifications: { volume: "750ml", alcohol: "14%" },
    category: "Bebidas",
    supplier: { id: "3", name: "Bodegas del Valle" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Queso Manchego",
    description: "Queso manchego curado D.O., 12 meses",
    sku: "QUE-004",
    categoryId: "1",
    supplierId: "3",
    price: 18.75,
    currency: "EUR",
    stock: 60,
    images: ["https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400"],
    rating: 4.6,
    reviewCount: 15,
    specifications: { weight: "500g", origin: "España" },
    category: "Alimentación",
    supplier: { id: "3", name: "Quesos Artesanos" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "5",
    name: "Café Premium Colombia",
    description: "Café 100% arábica de Colombia, tueste natural",
    sku: "CAF-005",
    categoryId: "2",
    supplierId: "3",
    price: 15.99,
    currency: "EUR",
    stock: 120,
    images: ["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400"],
    rating: 4.7,
    reviewCount: 28,
    specifications: { weight: "500g", origin: "Colombia" },
    category: "Bebidas",
    supplier: { id: "3", name: "Cafés del Mundo" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "6",
    name: "Pasta Italiana Artesanal",
    description: "Pasta artesanal de trigo duro, elaboración tradicional",
    sku: "PAS-006",
    categoryId: "1",
    supplierId: "3",
    price: 6.50,
    currency: "EUR",
    stock: 15,
    images: ["https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400"],
    rating: 4.5,
    reviewCount: 12,
    specifications: { weight: "500g", origin: "Italia" },
    category: "Alimentación",
    supplier: { id: "3", name: "Pasta Fresca" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "7",
    name: "Cerveza Artesana IPA",
    description: "Cerveza IPA artesana con lúpulos americanos",
    sku: "CER-007",
    categoryId: "2",
    supplierId: "3",
    price: 3.99,
    currency: "EUR",
    stock: 200,
    images: ["https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400"],
    rating: 4.6,
    reviewCount: 35,
    specifications: { volume: "330ml", alcohol: "6.5%" },
    category: "Bebidas",
    supplier: { id: "3", name: "Cervezas Artesanas" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "8",
    name: "Miel de Azahar",
    description: "Miel pura de azahar, producción local ecológica",
    sku: "MIE-008",
    categoryId: "1",
    supplierId: "3",
    price: 9.99,
    currency: "EUR",
    stock: 8,
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784422?w=400"],
    rating: 4.9,
    reviewCount: 22,
    specifications: { weight: "500g", origin: "España" },
    category: "Alimentación",
    supplier: { id: "3", name: "Mieles del Campo" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "9",
    name: "Chocolate Negro 85%",
    description: "Chocolate negro premium 85% cacao, sin azúcares añadidos",
    sku: "CHO-009",
    categoryId: "1",
    supplierId: "3",
    price: 4.50,
    currency: "EUR",
    stock: 95,
    images: ["https://images.unsplash.com/photo-1511381939415-e44015466834?w=400"],
    rating: 4.8,
    reviewCount: 19,
    specifications: { weight: "100g", origin: "Ecuador" },
    category: "Alimentación",
    supplier: { id: "3", name: "Chocolates Gourmet" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "10",
    name: "Zumo Natural Naranja",
    description: "Zumo de naranja recién exprimido, sin conservantes",
    sku: "ZUM-010",
    categoryId: "2",
    supplierId: "3",
    price: 5.75,
    currency: "EUR",
    stock: 12,
    images: ["https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400"],
    rating: 4.4,
    reviewCount: 16,
    specifications: { volume: "1L", origin: "España" },
    category: "Bebidas",
    supplier: { id: "3", name: "Zumos Naturales" },
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
    productCategories: ["Alimentación", "Aceites y Condimentos"],
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
    productCategories: ["Alimentación", "Carnes y Embutidos"],
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
    productCategories: ["Bebidas", "Vinos y Espumosos"],
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
    productCategories: ["Alimentación", "Frutas y Verduras"],
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
    productCategories: ["Alimentación", "Lácteos"],
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
    productCategories: ["Alimentación", "Varios"],
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
        productName: "Aceite de Oliva Virgen Extra",
        productImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
        supplierId: "3",
        supplierName: "Aceites del Sur",
        quantity: 12,
        unitPrice: 12.99,
        subtotal: 155.88,
        tax: 32.73,
      },
      {
        id: "2",
        productId: "2",
        productName: "Jamón Ibérico",
        productImage: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400",
        supplierId: "4",
        supplierName: "Ibéricos Premium",
        quantity: 2,
        unitPrice: 89.99,
        subtotal: 179.98,
        tax: 37.80,
      },
    ],
    subtotal: 335.86,
    tax: 70.53,
    shippingCost: 0,
    total: 406.39,
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
        productId: "3",
        productName: "Queso Manchego",
        productImage: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400",
        supplierId: "3",
        supplierName: "Aceites del Sur",
        quantity: 6,
        unitPrice: 18.50,
        subtotal: 111.00,
        tax: 23.31,
      },
    ],
    subtotal: 111.00,
    tax: 23.31,
    shippingCost: 0,
    total: 134.31,
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

const saveStoredOrders = (orders: any[]) => {
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

    register: async (data: any) => {
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

    create: async (orderData: any) => {
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
