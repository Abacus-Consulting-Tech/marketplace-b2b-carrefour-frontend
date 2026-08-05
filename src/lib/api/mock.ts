// Mock authentication for development/testing
// Enable by setting NEXT_PUBLIC_MOCK_AUTH=true in .env.local

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
];

// Mock API delay
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

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
