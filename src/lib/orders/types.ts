import { z } from "zod";
import { deliveryOptions } from "@/content/delivery";
import { configurationSchema } from "@/lib/price";

const deliveryIds = deliveryOptions.map((d) => d.id) as [string, ...string[]];

/** То, что приходит с клиента при оформлении: товар, конфигурация, количество. */
export const cartLineInputSchema = z.object({
  slug: z.string().min(1),
  config: configurationSchema,
  qty: z.number().int().min(1).max(99),
});

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя"),
  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[\d\s()-]{7,20}$/,
      "Телефон в формате +375 XX XXX-XX-XX",
    ),
  email: z.email("Проверьте адрес почты"),
  delivery: z.enum(deliveryIds),
  address: z.string().trim().max(300).optional(),
  comment: z.string().trim().max(1000).optional(),
  /**
   * Согласие на обработку данных, в том числе на передачу за границу
   * (хостинг, база, Telegram). По закону — отдельной отметкой, поэтому
   * без него сервер заказ не принимает.
   */
  consent: z.literal(true, {
    error: "Нужно согласие на обработку персональных данных",
  }),
});

export const checkoutInputSchema = z.object({
  customer: customerSchema,
  lines: z.array(cartLineInputSchema).min(1, "Корзина пуста"),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type CheckoutInput = z.infer<typeof checkoutInputSchema>;

export type OrderStatus = "new" | "pending_payment" | "paid" | "failed";

export type OrderLine = {
  slug: string;
  title: string;
  /** Расшифровка конфигурации человеческим языком — для письма и Telegram */
  options: string[];
  qty: number;
  unitPrice: number;
  approximate: boolean;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: CustomerInput;
  lines: OrderLine[];
  itemsTotal: number;
  deliveryPrice: number;
  total: number;
  /** Хотя бы одна позиция с предварительной ценой — сумму подтвердит мастер */
  approximate: boolean;
  currency: "BYN";
  /** Идентификатор платежа у эквайера, появляется на Фазе 5 */
  paymentId?: string;
};
