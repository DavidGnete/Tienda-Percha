"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

import { Product, ProductImage, Category } from "@/interfaces";

import clsx from "clsx";
import { CreateUpdateProduct, DeleteProductImage } from "@/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageProducts } from "@/components";
import { categoryLabel, genderLabels } from "@/utils";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductImage[] };
  categories: Category[];
}

// Atajos para marcar tallas comunes; también se pueden escribir opciones libres (ej. "100 ml")
const sizePresets = [
  { label: "Ropa", sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] },
  { label: "Zapatos", sizes: ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44"] },
];

const fieldLabels: Record<string, string> = {
  title: "Título",
  description: "Descripción",
  price: "Precio",
  inStock: "Inventario",
  gender: "Género",
  categoryId: "Categoría",
};

interface FormInputs {
  title: string;
  slug?: string;
  description: string;
  price: number;
  inStock?: number | string;
  sizes: string[];
  tags?: string;
  gender: "men" | "women" | "kid" | "unisex";
  categoryId: string;

  images?: FileList;
}

export const  ProductForm = ({ product, categories }: Props) => {

  const router = useRouter();
  const searchParams = useSearchParams();
  // Al crear, la página se vuelve a montar con el nuevo slug; ?saved=1 conserva el aviso
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string; slug?: string } | null>(
    searchParams.get("saved") && product.slug
      ? { type: "success", text: "Producto creado y publicado", slug: product.slug }
      : null,
  );


  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    resetField,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(", "),
      sizes: product.Size ?? [],

      images: undefined,
    },
  });

  watch("sizes");

  const onSizeChange = (size: string) => {
    const sizes = new Set(getValues("sizes"));
    sizes.has(size) ? sizes.delete(size) : sizes.add(size);

    setValue("sizes", Array.from(sizes));
  };

  const [customSize, setCustomSize] = useState("");

  const addCustomSize = () => {
    // La coma separa opciones al enviar el formulario, por eso no se permite dentro de una opción
    const size = customSize.replace(/,/g, "").trim();
    if (!size) return;

    const sizes = getValues("sizes");
    if (!sizes.includes(size)) setValue("sizes", [...sizes, size]);
    setCustomSize("");
  };

  const onSubmit = async (data: FormInputs) => {
    setMessage(null);

    const formData = new FormData();

    const {images, ...producToSave } = data;

    if ( product.id){
      formData.append("id", product.id ?? "");
    }
    formData.append("title", producToSave.title);
    formData.append("slug", producToSave.slug ?? "");
    formData.append("description", producToSave.description);
    formData.append("price", producToSave.price.toString());
    formData.append("inStock", String(producToSave.inStock ?? ""));
    formData.append("sizes", producToSave.sizes.toString());
    formData.append("tags", producToSave.tags ?? "");
    formData.append("categoryId", producToSave.categoryId);
    formData.append("gender", producToSave.gender);

    if ( images) {
      for (let i = 0; i < images.length; i++){
        formData.append('images', images[i]);
      }
    }

    try {
      const { ok, product: updateProduct, message } = await CreateUpdateProduct(formData);

      if ( !ok || !updateProduct ) {
        setMessage({ type: "error", text: message ?? "El producto no se pudo guardar" });
        return;
      }

      resetField("images");
      setMessage({
        type: "success",
        text: product.id ? "Producto actualizado" : "Producto creado y publicado",
        slug: updateProduct.slug,
      });

      if (product.id) {
        router.replace(`/admin/product/${updateProduct.slug}`);
        router.refresh();
      } else {
        router.replace(`/admin/product/${updateProduct.slug}?saved=1`);
      }
    } catch (error) {
      // Ej: las imágenes superan el límite de 10mb de las Server Actions
      console.error(error);
      setMessage({ type: "error", text: "Error al enviar el formulario. Revise el tamaño de las imágenes (máx. 10MB en total)" });
    }
  };

  const onDeleteImage = async (imageId: number, imageUrl: string) => {
    const resp = await DeleteProductImage(imageId, imageUrl);
    if (!resp?.ok) {
      setMessage({ type: "error", text: "No se pudo eliminar la imagen" });
      return;
    }
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      {message && (
        <div
          className={clsx("sm:col-span-2 p-3 rounded-md whitespace-pre-line", {
            "bg-green-100 text-green-800": message.type === "success",
            "bg-red-100 text-red-800": message.type === "error",
          })}
        >
          {message.text}
          {message.slug && (
            <Link href={`/product/${message.slug}`} className="ml-2 underline font-semibold">
              Ver en la tienda
            </Link>
          )}
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="sm:col-span-2 p-3 rounded-md bg-red-100 text-red-800">
          Complete todos los campos obligatorios:{" "}
          {Object.keys(errors).map((field) => fieldLabels[field] ?? field).join(", ")}
        </div>
      )}

      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug <small className="text-gray-500">(opcional)</small></span>
          <input
            type="text"
            placeholder="Se genera automáticamente desde el título"
            className="p-2 border rounded-md bg-gray-200"
            {...register("slug")}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register("description", { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Precio</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("price", { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Etiquetas <small className="text-gray-500">(opcional, separadas por coma)</small></span>
          <input
            type="text"
            placeholder="Se generan automáticamente"
            className="p-2 border rounded-md bg-gray-200"
            {...register("tags")}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Género</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("gender", { required: true })}
          >
            <option value="">[Seleccione]</option>
            {Object.entries(genderLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoría</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("categoryId", { required: true })}
          >
            <option value="">[Seleccione]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {categoryLabel(category.name)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Inventario <small className="text-gray-500">(opcional)</small></span>
          <input
            type="number"
            placeholder="Sin especificar"
            className="p-2 border rounded-md bg-gray-200"
            {...register("inStock", { min: 0 })}
          />
        </div>

        {/* Tallas / opciones: opcional (accesorios no llevan) */}
        <div className="flex flex-col">
          <span>Tallas / opciones <small className="text-gray-500">(opcional)</small></span>
          <small className="text-gray-500 mb-2">
            Marca tallas de ropa o zapatos, o escribe otras como &quot;100 ml&quot;. Déjalo vacío si el producto no tiene opciones.
          </small>

          {sizePresets.map((preset) => (
            <div key={preset.label} className="mb-2">
              <span className="text-sm text-gray-600">{preset.label}</span>
              <div className="flex flex-wrap">
                {preset.sizes.map((size) => (
                  <div
                    key={size}
                    onClick={() => onSizeChange(size)}
                    className={clsx(
                      "p-2  cursor-pointer text-center border rounded-md mr-2 mb-2 w-14 transition-all",
                      {
                        "bg-blue-500 text-white": getValues("sizes").includes(size),
                      },
                    )}
                  >
                    <span>{size}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex mb-2">
            <input
              type="text"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomSize();
                }
              }}
              maxLength={30}
              placeholder="Otra opción, ej. 100 ml"
              className="p-2 border rounded-md bg-gray-200 flex-1 mr-2"
            />
            <button type="button" onClick={addCustomSize} className="btn-secondary">
              Agregar
            </button>
          </div>

          {getValues("sizes").length > 0 && (
            <div className="flex flex-wrap mb-4">
              <span className="text-sm text-gray-600 mr-2 py-1">Seleccionadas:</span>
              {getValues("sizes").map((size) => (
                <span
                  key={size}
                  className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2 text-sm"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => onSizeChange(size)}
                    className="ml-2 font-bold cursor-pointer"
                    aria-label={`Quitar ${size}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              type="file"
              {...register('images') }
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id}>
                <ImageProducts
                  alt={product.title ?? ""}
                  src={image.url}
                  width={400}
                  height={300}
                  className="rounded-t shadow-md"
                />

                <button
                  type="button"
                  onClick={() => onDeleteImage(image.id, image.url)}
                  className="btn-danger w-full rounded-b-xl cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
