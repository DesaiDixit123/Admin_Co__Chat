import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useProductData } from "../../Store/Selectors/Product/Product_Selector";
import { productsGetOne } from "../../Store/Action/Product/Product_Action";
import { assets } from "../../assets/images/assets";

const ProductDetails = () => {
    const [activeMedia, setActiveMedia] = useState(0);
    const { id } = useParams();
    const dispatch = useDispatch();

    const productData = useProductData();
    const product = productData || {};
    const business = product?.businessid || {};

    useEffect(() => {
        if (id) {
            dispatch(productsGetOne({ productId: id }));
        }
    }, [id, dispatch]);

    /* ----------------------------------------
       BUILD MEDIA ARRAY (IMAGES + VIDEOS)
    ----------------------------------------- */
    const media = useMemo(() => {
        const baseUrl =
            "https://scalelotcloudsolutions.s3.ap-south-1.amazonaws.com/";

        const mainImage = product?.image
            ? [
                {
                    type: "image",
                    src: `${baseUrl}${product.image}`,
                },
            ]
            : [];

        const images =
            product?.images?.map((img) => ({
                type: "image",
                src: `${baseUrl}${img}`,
            })) || [];

        const videos =
            product?.videos?.map((vid) => ({
                type: "video",
                src: `${baseUrl}${vid}`,
            })) || [];

        return [...mainImage, ...images, ...videos];
    }, [product]);
    /* ----------------------------------------
       PRICE CALCULATION
    ----------------------------------------- */
    const originalPrice = product?.price || 0;
    const discount =
        product?.offer_type === "percentage"
            ? (originalPrice * product?.offer) / 100
            : product?.offer || 0;

    const finalPrice = originalPrice - discount;

    return (
        <>
            <Header name="Products" />

            <div className="p-5 lg:p-7 mx-auto">
                {/* Top Bar */}
                <div className="flex items-center space-x-3 mb-6">
                    <Link to="../products" className="icon-arrow-right rotate-180 text-20" />
                    <h2 className="text24 font-bold text-g1">Product Details</h2>
                </div>

                <div className="flex flex-col xl:flex-row space-y-12 xl:space-y-0 xl:space-x-14">

                    {/* ================= IMAGE SECTION ================= */}
                    <div className="flex flex-col xl:flex-row flex-1 space-y-6 xl:space-y-0 xl:space-x-6">

                        {/* Thumbnails */}
                        <div className="flex xl:flex-col space-x-4 xl:space-x-0 xl:space-y-4">
                            {media.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveMedia(i)}
                                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition bg-gray-200
                    ${activeMedia === i ? "border-primary scale-105" : "border-transparent opacity-60 hover:opacity-100"}
                  `}
                                >
                                    {item.type === "image" ? (
                                        <img src={item.src} className="w-full h-full object-contain" />
                                    ) : (<>
                                        <video src={item.src} className="w-full h-full object-contain" />
                                        <div className="w-full h-full flex items-center justify-center bg-black text-white">
                                            ▶
                                        </div>
                                    </>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Main Media */}
                        <div className="relative flex-1 max-w-[520px] mx-auto">
                            <div className="aspect-square rounded-[32px] overflow-hidden bg-gray-100 shadow-lg flex items-center justify-center">
                                {media[activeMedia]?.type === "image" ? (
                                    <img
                                        src={media[activeMedia]?.src}
                                        className="w-full max-w-full max-h-full object-contain"
                                        alt="Product"
                                    />
                                ) : (
                                    <video
                                        src={media[activeMedia]?.src}
                                        className="w-full max-w-full max-h-full object-contain"
                                        controls
                                        autoPlay
                                    />
                                )}
                            </div>

                            {product?.offer > 0 && (
                                <span className="absolute top-5 right-5 bg-white px-4 py-2 rounded-full text-red font-black shadow">
                                    {product.offer}% OFF
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ================= CONTENT ================= */}
                    <div className="flex flex-col flex-1 space-y-10">

                        {/* Product Info */}
                        <div>
                            <span className="text-xs uppercase font-bold tracking-widest text-primary">
                                Product
                            </span>
                            <h1 className="text-4xl font-black text-g1">
                                {product?.name}
                            </h1>
                        </div>

                        {/* Price */}
                        <div className="flex items-center space-x-4">
                            <span className="text-4xl font-black text-g1">
                                ₹{finalPrice}
                            </span>
                            {discount > 0 && (
                                <span className="text-lg line-through text-g7">
                                    ₹{originalPrice}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white border rounded-3xl p-8 space-y-3">
                            <h3 className="font-bold text-lg">Product Description</h3>
                            <p className="text-g7">{product?.description}</p>
                        </div>

                        {/* ================= BUSINESS CARD ================= */}
                        <div className="bg-white border rounded-3xl p-8 space-y-6">

                            {/* Header */}
                            <div className="flex items-center space-x-4">
                                <img
                                    src={business?.profileimage ? `https://scalelotcloudsolutions.s3.ap-south-1.amazonaws.com/${business?.profileimage}` : assets.userDefaultImg}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-xl font-bold">{business?.name}</h3>
                                    <a
                                        href={business?.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-primary"
                                    >
                                        {business?.website}
                                    </a>
                                </div>
                            </div>

                            {/* About */}
                            <p className="text-sm text-g7">{business?.about}</p>

                            {/* Categories */}
                            <div>
                                <p className="text-xs font-bold uppercase text-g7 mb-2">
                                    Categories
                                </p>
                                <div className="flex flex-wrap space-x-2 font-semibold">

                                    {business?.categories
                                        ?.map((cat) => {
                                            const parentName = cat?.parent_category?.name;
                                            const childNames = cat?.child_categories?.map((c) => c.name).join(", ");
                                            return childNames ? `${parentName} (${childNames})` : parentName;
                                        })
                                        .join(", ")}
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="flex flex-wrap pt-4 border-t -mx-2">
                                <div className="w-full sm:w-1/2 p-2">
                                    <p className="text-xs font-bold text-g7">Website</p>
                                    <p className="font-semibold">
                                        {business?.website || "-"}
                                    </p>
                                </div>
                                <div className="w-full sm:w-1/2 p-2">
                                    <p className="text-xs font-bold text-g7">Email</p>
                                    <p className="font-semibold">
                                        {business?.email || "-"}
                                    </p>
                                </div>
                                <div className="w-full sm:w-1/2 p-2">
                                    <p className="text-xs font-bold text-g7">Phone</p>
                                    <p className="font-semibold">
                                        {business?.mobile_country_code} {business?.mobile}
                                    </p>
                                </div>
                                <div className="w-full sm:w-1/2 p-2">
                                    <p className="text-xs font-bold text-g7">WhatsApp</p>
                                    <p className="font-semibold">
                                        {business?.wamobile ? `${business?.wamobile_country_code} ${business?.wamobile}` : "-"}

                                    </p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="pt-4 border-t text-sm">
                                <p className="font-semibold mb-1">Address</p>
                                <p className="capitalize">
                                    {[
                                        business?.address?.street,
                                        business?.address?.city,
                                        business?.address?.state,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;
