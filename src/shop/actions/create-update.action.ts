import { tesloApi } from "@/api/tesloApi";
import { sleep } from "@/lib/sleep";
import type { Product } from "@/types/product.interface";

export interface FileUploadResponse {
    secureUrl: string;
    fileName: string;
}

export const createUpdateAction = async (productLike: Partial<Product> & { files?: File[] }): Promise<Product> => {

    await sleep(1500);

    const { id, user, images = [], files = [], ...rest } = productLike;

    console.log({ files })

    const isCreating = id === 'new';

    rest.stock = Number(rest.stock || 0)
    rest.price = Number(rest.price || 0)

    //Preparar las imagenes
    if (files.length > 0) {
        const newImageNames = await uploadFiles(files);
        images.push(...newImageNames);
    }

    const { data } = await tesloApi<Product>({
        url: isCreating ? '/products' : `/products/${id}`,
        method: isCreating ? 'POST' : 'PATCH',
        data: {
            ...rest,
            images,
        },
    })

    return {
        ...data,
        images: data.images.map(image => {
            if (image.includes('http')) return image;
            return `${import.meta.env.VITE_API_URL}/files/product/${image}`
        })
    }

}

const uploadFiles = async (files: File[]): Promise<string[]> => {

    const uploadPromises = files.map(async (file) => {

        const formData = new FormData();

        formData.append('file', file)

        const { data } = await tesloApi<FileUploadResponse>({
            url: '/files/product',
            method: 'POST',
            data: formData,
        })

        const splitString = data.fileName.split('/')

        return splitString[splitString.length - 1];

    })

    const fileNames = await Promise.all(uploadPromises);

    return fileNames;

}