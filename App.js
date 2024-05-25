import { mesClasse, previews } from "./data";

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector(".container");
    const previewBg = document.querySelector(".preview-bg");
    const items = document.querySelectorAll(".item"); // Utilisation de querySelectorAll pour obtenir tous les éléments
    let activePreview = document.querySelector(".preview-default");
    let isMouseOverItem = false;

    const defaultClipPath = {
        "variant-1": "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        "variant-2": "polygon(100% 0%, 100% 0%, 100% 100%, 0% 100%)", // Correction du point-virgule en virgule
        "variant-3": "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
    };

    const variantTransform = {
        "variant-1": {
            title: { x: 75, opacity: 0 },
            tags: { y: -75, opacity: 0 },
            description: { x: -75, opacity: 0 }
        },
        "variant-2": {
            title: { x: -75, opacity: 0 },
            tags: { y: -75, opacity: 0 },
            description: { x: 75, opacity: 0 }
        },
        "variant-3": {
            title: { x: 75, opacity: 0 },
            tags: { y: 75, opacity: 0 },
            description: { x: 75, opacity: 0 }
        },
    };

    function getDefaultClipPath(previewElement) {
        for (const variant in defaultClipPath) {
            if (previewElement.classList.contains(variant)) {
                return defaultClipPath[variant];
            }
        }
        return "polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%)";
    }

    function applyVariantStyle(previewElement) {
        const variant = previewElement.className
            .split(" ")
            .find((className) => className.startsWith("variant-"));
        if (variant && variantTransform[variant]) {
            Object.entries(variantTransform[variant]).forEach(([elementClass, transform]) => {
                const element = previewElement.querySelector(`.preview-${elementClass}`);
                if (element) {
                    gsap.set(element, transform);
                }
            });
        }
    }

    function changeBg(newImgSrc) {
        const newImg = document.createElement("img"); // Correction : création d'un nouvel élément img
        newImg.src = newImgSrc;
        newImg.style.position = "absolute";
        newImg.style.top = "0";
        newImg.style.left = "0";
        newImg.style.width = "100%";
        newImg.style.height = "100%";
        newImg.style.objectFit = "cover";
        newImg.style.opacity = "0";

        previewBg.appendChild(newImg);

        gsap.to(newImg, { opacity: 1, duration: 0.5 });

        if (previewBg.children.length > 1) {
            const oldImg = previewBg.children[0];
            gsap.to(oldImg, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    previewBg.removeChild(oldImg);
                },
            });
        }
    }

    previews.forEach((preview, index) => {
        const previewElement = document.createElement("div"); // Correction : création d'un élément div
        previewElement.className = `preview ${mesClasse[index]} preview-${index + 1}`;
        previewElement.innerHTML = `
        <div class="preview-img"> <img src="${preview.img}" alt="" /></div>
        <div class="preview-title"> <h1>${preview.title}</h1></div>
        <div class="preview-tags"> <p>${preview.tags}</p></div>
        <div class="preview-description"> <p>${preview.description}</p></div>
        `;
        container.appendChild(previewElement);
        applyVariantStyle(previewElement);
    });

    items.forEach((item, index) => {
        item.addEventListener("mouseenter", () => { // Correction : utilisation de "mouseenter" en chaîne de caractères
            isMouseOverItem = true;
            const newBg = `./image-${index + 1}.jpg`;
            changeBg(newBg);

            const newActivePreview = document.querySelector(`.preview-${index + 1}`);
            if (activePreview && activePreview != newActivePreview) {
                const previousActivePreviewImg = activePreview.querySelector(".preview-img");
                const previousDefaultClipPath = getDefaultClipPath(activePreview);
                gsap.to(previousActivePreviewImg, {
                    clipPath: previousDefaultClipPath, // Correction : clipaPath en clipPath
                    duration: 0.75,
                    ease: "power3.out",
                });
                gsap.to(activePreview, {
                    opacity: "0",
                    duration: 0.3,
                    delay: 0.2 // Correction : delai en delay
                });
                gsap.to(newActivePreview, {
                    opacity: 1,
                    duration: 0.1
                });
                activePreview = newActivePreview;

                const elementsToAnimate = ["title", "tags", "description"];
                elementsToAnimate.forEach((el) => {
                    const element = newActivePreview.querySelector(`.preview-${el}`);
                    if (element) {
                        gsap.to(element, { x: 0, y: 0, opacity: 1, duration: 0.5 });
                    }
                });

                const activePreviewImg = activePreview.querySelector(".preview-img");
                gsap.to(activePreviewImg, {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Correction : clipaPath en clipPath
                    duration: 1,
                    ease: "power3.out"
                });
            }
        });
    });

    items.forEach(item => { // Correction : ajout d'un foreach pour chaque item
        item.addEventListener("mouseleave", () => { // Correction : utilisation de "mouseleave" en chaîne de caractères
            isMouseOverItem = false;
            applyVariantStyle(activePreview, true);

            setTimeout(() => {
                if (!isMouseOverItem) {
                    changeBg("./image/bg.jpg");
                    if (activePreview) {
                        gsap.to(activePreview, {
                            opacity: 0,
                            duration: 0.1,
                        });
                        const defaultPreview = document.querySelector(".preview-default");
                        gsap.to(defaultPreview, {
                            opacity: 1,
                            duration: 0.1,
                        });
                        activePreview = defaultPreview;

                        const activePreviewImg = activePreview.querySelector(".preview-img");
                        const defaultClipPath = getDefaultClipPath(activePreview);
                        gsap.to(activePreviewImg, { // Correction : gsap.to sur activePreviewImg au lieu de defaultClipPath
                            clipPath: defaultClipPath, // Correction : clipaPath en clipPath
                            duration: 1,
                            ease: "power3.out"
                        });
                    }
                }
            }, 10);
        });
    });
});
