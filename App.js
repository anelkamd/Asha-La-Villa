import { mesClasse , previews  } from "./data";

document.addEventListener('DOMContentLoaded', function() {
     const container =  document.querySelector(".container");
     const previews = document.querySelector(".preview-bg");
     const items = document.querySelector(".item");
     let activePreview = document.querySelector(".preview-default");
     let isMouseOverItem = false;

     const defaultClipPash = {
        "variant-1": "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        "variant-2": "polygon(100% 0%, 100% 0%, 100% 100%, 0% 100%);",
        "variant-3": "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);"
     };

     const variantTransform = {
        "variant-1": {
            tittle: {x: 75, opacity: 0},
            tags: { y: -75, opacity: 0},
            description: {x: -75, opacity: 0}
        },
        "variant-2": {
            tittle: {x: -75, opacity: 0},
            tags: { y: -75, opacity: 0},
            description: {x: 75, opacity: 0}
        },
        "variant-3": {
            tittle: {x: 75, opacity: 0},
            tags: { y: 75, opacity: 0},
            description: {x: 75, opacity: 0}
        },
     };

     function getDefautlClipPach (previewElement) {
         for( const variant in defaultClipPash) {
            if (previewElement.classList.contains(variant)) {
                return defaultClipPash[variant];
            }
         }
         return "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)"
     }
     function applyVariantStyle (previewElement) {
        const variant = previewElement.className
            .split(" ")
            .find((className) => className.startsWith("variant-"));
        if ( variant && variantTransform[variant]) {
            Object.entries(variantTransform[variant]).forEach(([ElementClass, transform]) => {
                const element = previewElement.querySelector(`.preview-$`,{ElementClass});
                if (element) {
                    gsap.set(element, transform)
                }
            }
        );
        }
     }
     function changeBg (newImgSrc) {
        const newImg = document.querySelector("img");
        newImg.src = newImgSrc;
        newImg.style.position = "absolute";
        newImg.style.top = "0";
        newImg.style.left = "0";
        newImg.style.width = "100%";
        newImg.style.height = "100%";
        newImg.style.objectFit = "cover";
        newImg.style.opacity = "0";

        previewBg.appendChild(newImg);

        gsap.to(newImg, { opacity: 1, duration: 0.5});

        if (previewBg.children.length > 1) {
            const oldImg = previewBg .children[0];
            gsap.to(oldImg, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    previewBg.removeChild(oldImg)
                },
            });
        }

     }
})