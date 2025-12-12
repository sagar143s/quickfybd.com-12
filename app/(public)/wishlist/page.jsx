'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import {
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  StarIcon,
  CheckCircle2
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cart/cartSlice";
import PageTitle from "@/components/PageTitle";
import Loading from "@/components/Loading";
import DashboardSidebar from "@/components/DashboardSidebar";

const PLACEHOLDER_IMAGE = "/placeholder.png"; // add in /public

function WishlistAuthed() {
  const { user, isSignedIn, loading: authLoading } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const userId = user?.uid;

  const [wishlist, setWishlist] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  /* -----------------------------------------
     FETCH WISHLIST
  ----------------------------------------- */
  useEffect(() => {
    if (authLoading) return;

    if (!isSignedIn) {
      loadGuestWishlist();
    } else {
      loadUserWishlist();
    }
  }, [authLoading, isSignedIn]);

  const loadGuestWishlist = () => {
    try {
      setLoading(true);
      if (typeof window === "undefined") return;

      const data = JSON.parse(
        localStorage.getItem("guestWishlist") || "[]"
      );
      setWishlist(Array.isArray(data) ? data : []);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserWishlist = async () => {
    try {
      setLoading(true);
      const token = await user.getIdToken(true);

      const { data } = await axios.get("/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWishlist(Array.isArray(data?.wishlist) ? data.wishlist : []);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------
     REMOVE FROM WISHLIST (FIXED)
  ----------------------------------------- */
  const removeFromWishlist = async (productId) => {
    try {
      if (!isSignedIn) {
        const updated = wishlist.filter(
          (item) => item.productId !== productId
        );
        localStorage.setItem("guestWishlist", JSON.stringify(updated));
        setWishlist(updated);
        setSelectedItems((prev) => prev.filter((id) => id !== productId));
        window.dispatchEvent(new Event("wishlistUpdated"));
        return;
      }

      const token = await user.getIdToken(true);
      await axios.post(
        "/api/wishlist",
        { productId, action: "remove" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error("Wishlist remove failed", err);
    }
  };

  /* -----------------------------------------
     CART
  ----------------------------------------- */
  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        product,
        userId,
        user: {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL
        }
      })
    );
  };

  const addSelectedToCart = async () => {
    if (!selectedItems.length) return;

    setAddingToCart(true);
    try {
      selectedItems.forEach((id) => {
        const item = wishlist.find((w) => w.productId === id);
        if (item?.product) {
          handleAddToCart(item.product);
        }
      });
      alert(`${selectedItems.length} item(s) added to cart`);
    } finally {
      setAddingToCart(false);
    }
  };

  /* -----------------------------------------
     HELPERS
  ----------------------------------------- */
  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(
      selectedItems.length === wishlist.length
        ? []
        : wishlist.map((w) => w.productId)
    );
  };

  const totalAmount = selectedItems.reduce((sum, id) => {
    const item = wishlist.find((w) => w.productId === id);
    return sum + Number(item?.product?.price || 0);
  }, 0);

  /* -----------------------------------------
     LOADING
  ----------------------------------------- */
  if (authLoading || loading) return <Loading />;

  return (
    <>
      <PageTitle title="My Wishlist" />

      <div
        className={`max-w-7xl mx-auto px-4 py-8 ${
          isSignedIn ? "grid grid-cols-1 md:grid-cols-4 gap-6" : ""
        }`}
      >
        {isSignedIn && <DashboardSidebar />}

        <main className={isSignedIn ? "md:col-span-3" : ""}>
          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <HeartIcon size={60} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold">Wishlist is empty</h2>
              <button
                onClick={() => router.push("/shop")}
                className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {wishlist.length} Items
                </h2>
                <button
                  onClick={selectAll}
                  className="text-orange-500 text-sm font-medium"
                >
                  {selectedItems.length === wishlist.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => {
                  const product = item?.product;
                  if (!product) return null;

                  const images = Array.isArray(product.images)
                    ? product.images
                    : [];
                  const imageSrc = images[0] || PLACEHOLDER_IMAGE;

                  const ratings = Array.isArray(product.rating)
                    ? product.rating
                    : [];
                  const avgRating = ratings.length
                    ? (
                        ratings.reduce(
                          (a, r) => a + Number(r.rating || 0),
                          0
                        ) / ratings.length
                      ).toFixed(1)
                    : null;

                  const isSelected = selectedItems.includes(item.productId);

                  return (
                    <div
                      key={item.productId}
                      className={`border-2 rounded-lg bg-white ${
                        isSelected
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="relative aspect-square bg-gray-50">
                        <Image
                          src={imageSrc}
                          alt={product.name}
                          fill
                          className="object-contain p-4 cursor-pointer"
                          onClick={() =>
                            router.push(`/product/${product.slug}`)
                          }
                        />

                        <button
                          onClick={() =>
                            removeFromWishlist(item.productId)
                          }
                          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
                        >
                          <TrashIcon size={16} className="text-red-500" />
                        </button>

                        <button
                          onClick={() => toggleSelect(item.productId)}
                          className="absolute top-3 left-3"
                        >
                          <CheckCircle2
                            className={
                              isSelected
                                ? "text-orange-500"
                                : "text-gray-300"
                            }
                          />
                        </button>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-2">
                          {product.name}
                        </h3>

                        {avgRating && (
                          <div className="flex items-center gap-1 text-sm mt-1">
                            <StarIcon
                              size={14}
                              fill="#FFA500"
                              className="text-orange-500"
                            />
                            {avgRating}
                          </div>
                        )}

                        <div className="mt-2 font-bold text-lg">
                          ₹{product.price}
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Mobile Bar */}
      {selectedItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs">{selectedItems.length} selected</p>
              <p className="font-bold">₹{totalAmount.toFixed(2)}</p>
            </div>
            <button
              onClick={addSelectedToCart}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function WishlistPage() {
  return <WishlistAuthed />;
}
