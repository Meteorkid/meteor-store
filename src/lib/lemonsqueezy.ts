// Lemon Squeezy integration
// Document: https://docs.lemonsqueezy.com/api

export const LEMON_SQUEEZY_CONFIG = {
  // Replace with your actual Lemon Squeezy API key
  apiKey: process.env.LEMON_SQUEEZY_API_KEY || '',
  // Replace with your actual store ID
  storeId: process.env.LEMON_SQUEEZY_STORE_ID || '',
  // Replace with your actual variant IDs for each product
  variants: {
    // OmniCrawl
    'omnicrawl-starter': process.env.LEMON_SQUEEZY_OMNICRAWL_STARTER || '',
    'omnicrawl-pro': process.env.LEMON_SQUEEZY_OMNICRAWL_PRO || '',
    'omnicrawl-enterprise': process.env.LEMON_SQUEEZY_OMNICRAWL_ENTERPRISE || '',
    // Ex-Memory
    'ex-memory-basic': process.env.LEMON_SQUEEZY_EXMEMORY_BASIC || '',
    'ex-memory-premium': process.env.LEMON_SQUEEZY_EXMEMORY_PREMIUM || '',
    'ex-memory-ultimate': process.env.LEMON_SQUEEZY_EXMEMORY_ULTIMATE || '',
    // Skeleton Anatomy
    'skeleton-anatomy-student': process.env.LEMON_SQUEEZY_SKELETON_STUDENT || '',
    'skeleton-anatomy-professional': process.env.LEMON_SQUEEZY_SKELETON_PROFESSIONAL || '',
    'skeleton-anatomy-institution': process.env.LEMON_SQUEEZY_SKELETON_INSTITUTION || '',
    // UI Design System
    'ui-design-system-solo': process.env.LEMON_SQUEEZY_UIDESIGN_SOLO || '',
    'ui-design-system-team': process.env.LEMON_SQUEEZY_UIDESIGN_TEAM || '',
    'ui-design-system-enterprise': process.env.LEMON_SQUEEZY_UIDESIGN_ENTERPRISE || '',
    // Statux
    'statux-pro': process.env.LEMON_SQUEEZY_STATUX_PRO || '',
    // XIsland
    'xisland-pro': process.env.LEMON_SQUEEZY_XISLAND_PRO || '',
    // Tollow
    'tollow-pro': process.env.LEMON_SQUEEZY_TOLLOW_PRO || '',
    // XNook
    'xnook-pro': process.env.LEMON_SQUEEZY_XNOOK_PRO || '',
    // Chakra Visualizer
    'chakra-visualizer-premium': process.env.LEMON_SQUEEZY_CHAKRA_PREMIUM || '',
  },
};

// Generate checkout URL for a product
export function getCheckoutUrl(productId: string): string {
  const variantId = LEMON_SQUEEZY_CONFIG.variants[productId as keyof typeof LEMON_SQUEEZY_CONFIG.variants];

  if (!variantId) {
    console.error(`No variant ID found for product: ${productId}`);
    return '#';
  }

  // Lemon Squeezy checkout URL format
  return `https://store.lemonsqueezy.com/checkout/buy/${variantId}`;
}

// Create checkout session via API (optional, for more control)
export async function createCheckoutSession(productId: string, email?: string) {
  const variantId = LEMON_SQUEEZY_CONFIG.variants[productId as keyof typeof LEMON_SQUEEZY_CONFIG.variants];

  if (!variantId) {
    throw new Error(`No variant ID found for product: ${productId}`);
  }

  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LEMON_SQUEEZY_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.lemonsqueezy.v1+json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: email || '',
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success`,
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: LEMON_SQUEEZY_CONFIG.storeId,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variantId,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const data = await response.json();
  return data.data.attributes.url;
}
