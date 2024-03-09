import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Account from "@/models/Account.model";
import Badge from "@/models/Badge.model";
import Client from "@/models/Client.model";
import Incoming from "@/models/Incoming.model";
import Outgoing from "@/models/Outgoing.model";
import Product from "@/models/Product.model";
import ProductVariant from "@/models/ProductVariant.model";
import { Model } from "mongoose";
import connectDB from "./mongoose";
import chalk from "chalk";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
var bcrypt = require("bcryptjs");

export const COOKIE_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 1 Month

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  password = bcrypt.hashSync(password, salt);
  return password;
};

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};

export const nameToModel = {
  account: Account,
  badge: Badge,
  client: Client,
  incoming: Incoming,
  outgoing: Outgoing,
  product: Product,
  productvariant: ProductVariant,
};

export const getAllItems = async (
  model: Model<any>,
  pageIndex: number,
  pageSize: number,
  account_id: string
) => {
  await connectDB();

  if (model === Account) {
    const items = await model
      .find({
        _id: account_id,
      })
      .select("-password");

    return items;
  }

  console.log(account_id);
  const items = await model
    .find({
      account_id,
    })
    .skip(pageIndex * pageSize)
    .limit(pageSize)
    .populate("account_id");
  return items;
};

export const createItem = async (
  model: Model<any>,
  data: any,
  account_id: string
) => {
  await connectDB();

  const item = await model.create({ ...data, account_id });
  return item;
};

export const checkLogin = async (data: {
  username: string;
  password: string;
}) => {
  await connectDB();

  const item = await Account.findOne({ username: data.username });
  if (!item) return null;

  const passwordMatch = comparePassword(data.password, item.password);
  if (!passwordMatch) return null;

  return item;
};

const key = new TextEncoder().encode(process.env.SECRET);

export const encrypt = async (payload: any) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30 days from now")
    .sign(key);
};

export const decrypt = async (token: string): Promise<any> => {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });
  return payload;
};

export const updateSession = async (request: NextRequest) => {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.rewrite("/auth/sign-in");
    }

    // Refresh the token so it doesn't expire
    const parsed = await decrypt(session);

    parsed.expires = new Date(Date.now() + COOKIE_EXPIRATION_TIME);
    const res = NextResponse.next();

    res.cookies.set({
      name: "session",
      value: await encrypt(parsed),
      httpOnly: true,
      expires: parsed.expires,
    });

    return res;
  } catch (error) {
    console.log(error);

    const res = NextResponse.redirect(new URL("/auth/sign-in", request.url));
    res.cookies.set("session", "", {
      expires: new Date(0),
    });

    return res;
  }
};

export const getSession = async () => {
  const session = cookies().get("session")?.value;
  if (!session) return null;

  const data = await decrypt(session);
  return data;
};

export const logout = async () => {
  cookies().set("session", "", {
    expires: new Date(0),
  });
};
