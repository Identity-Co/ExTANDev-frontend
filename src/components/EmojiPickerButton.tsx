"use client";

import React, { useState, useRef, useEffect, CSSProperties } from "react";
import ReactDOM from "react-dom";

const emojiCategories: Record<string, string[]> = {
  "😀": ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","😘","🥰","😗","😙","😚","🙂","🤗","🤩","🤔","🤨","😐","😑","😶","🙄","😏","😣","😥","😮","🤐","😯","😪","😫","🥱","😴","😌","😛","😜","😝","🤤","😒","😓","😔","😕","🙃","😖","😞","😟","😤","😢","😭","😦","😧","😨","😩","🤯","😬","😰","😱","🥵","🥶","😳","🤪","😵","🥴","😠","😡","🤬","😷","🤒","🤕","🤢","🤮","🤧","😇","🥳","🤠","🤡","💩","👻","💀","☠️","👽","👾","🤖","🎃"],
  "👋": ["👋","🤚","🖐️","✋","🖖","👌","🤏","✌️","🤞","🤟","🤘","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🦷","🦴","👀","👁️","👅","👄"],
  "🐶": ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐻‍❄️","🐨","🐯","🦁","🐮","🐷","🐽","🐸","🐵","🙈","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦧","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛","🐓","🦃","🦚","🦜","🦢","🦩","🕊️","🐇","🦝","🦨","🦡","🦦","🦥","🐁","🐀","🐿️","🦔"],
  "🍎": ["🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶️","🌽","🥕","🧄","🧅","🥔","🍠","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🦴","🌭","🍔","🍟","🍕","🥪","🥙","🧆","🌮","🌯","🥗","🥘","🥫","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","🍘","🍥","🥠","🥮","🍢","🍡","🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜","🍯","🥛","🍼","☕","🍵","🧃","🥤","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧉","🍾","🧊","🥄","🍴","🍽️","🥣","🥡","🥢"],
  "⚽": ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🏒","🏑","🥍","🏏","🎿","⛷️","🏂","🪂","🏋️‍♀️","🏋️","🏋️‍♂️","🤼‍♀️","🤼","🤼‍♂️","🤸‍♀️","🤸","🤸‍♂️","⛹️‍♀️","⛹️","⛹️‍♂️","🤺","🤾‍♀️","🤾","🤾‍♂️","🏌️‍♀️","🏌️","🏌️‍♂️","🏇","🧘‍♀️","🧘","🧘‍♂️","🏄‍♀️","🏄","🏄‍♂️","🏊‍♀️","🏊","🏊‍♂️","🤽‍♀️","🤽","🤽‍♂️","🚣‍♀️","🚣","🚣‍♂️","🧗‍♀️","🧗","🧗‍♂️","🚵‍♀️","🚵","🚵‍♂️","🚴‍♀️","🚴","🚴‍♂️","🏆","🥇","🥈","🥉","🏅","🎖️","🏵️","🎗️","🎫","🎟️","🎪","🤹‍♀️","🤹","🤹‍♂️","🎭","🩰","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🪕","🎻","🎲","♟️","🎯","🎳","🎮","🎰"],
  "❤️": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟"],
  "🌍": ["🌍","🌎","🌏","🌐","🗺️","🗾","🧭","🏔️","⛰️","🌋","🗻","🏕️","🏖️","🏜️","🏝️","🏞️","🏟️","🏛️","🏗️","🧱","🏘️","🏚️","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🛕","🕍","⛩️","🕋","⛲","⛺","🌁","🌃","🏙️","🌄","🌅","🌆","🌇","🌉","♨️","🎠","🎡","🎢","💈","🎪","🚂","🚃","🚄","🚅","🚆","🚇","🚈","🚉","🚊","🚝","🚞","🚋","🚌","🚍","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🚚","🚛","🚜","🏎️","🏍️","🛵","🚲","🛴","🛹","🚏","🛣️","🛤️","🛢️","⛽","🚨","🚥","🚦","🛑","🚧","⚓","⛵","🛶","🚤","🛳️","⛴️","🛥️","🚢","✈️","🛩️","🛫","🛬","🪂","💺","🚁","🚟","🚠","🚡","🛰️","🚀","🛸"],
  "⭐": ["⭐","🌟","🌠","🌌","☁️","⛅","🌤️","🌥️","🌦️","🌧️","⛈️","🌩️","🌨️","❄️","☃️","⛄","🌪️","🌫️","🌬️","🌀","🌈","🌂","☂️","☔","⛱️","⚡","❄️","🔥","💧","🌊"],
  "💡": ["💡","🔦","🕯️","🪔","🧯","🛢️","💸","💵","💴","💶","💷","💰","💳","💎","⚖️","🧰","🔧","🔨","⛏️","🔩","⚙️","🧱","⛓️","🧲","🔫","💣","🧨","🪓","🔪","🗡️","⚔️","🛡️","🚬","⚰️","⚱️","🏺","🔮","📿","🧿","💈","⚗️","🔭","🔬","🕳️","🩹","🩺","💊","💉","🩸","🧬","🦠","🧫","🧪","🌡️","🧹","🧺","🧻","🚽","🚰","🚿","🛁","🛀","🧼","🪒","🧽","🧴","🛎️","🔑","🗝️","🚪","🪑","🛋️","🛏️","🛌","🧸","🖼️","🎁","🎈","🎏","🎀","🎊","🎉","🎎","🏮","🎐","✉️","🧧","📩","📨","📧","💌","📥","📤","📦","🏷️","📪","📫","📬","📭","📮","📯","📜","📃","📄","📑","🧾","📊","📈","📉","🗒️","🗓️","📆","📅","🗑️","📇","🗃️","🗳️","🗄️","📋","📁","📂","🗂️","📔","📕","📗","📘","📙","📚","📓","🗞️","📰","🎞️","📽️","🎬","📺","📷","📹","📼","🔍","🔎","🕯️","💡","🔦","🏮","🪔"],
};

// Better responsive units - use clamp() for mobile-friendly sizes
const responsiveSize = (minPx: number, maxPx: number, minVw: number = 320, maxVw: number = 1920) => {
  return `clamp(${minPx}px, ${(maxPx / maxVw) * 100}vw, ${maxPx}px)`;
};

// For smaller elements that don't need as much scaling
const pxToVw = (px: number) => `${(px / 1920) * 100}vw`;

interface Props {
  quillRef: any;
  buttonOffset?: { x?: number; y?: number };
  maxWidth?: number;
}

export default function EmojiPickerButton({ quillRef, buttonOffset, maxWidth = 260 }: Props) {
  const [open, setOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(Object.keys(emojiCategories)[0]);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [popupStyle, setPopupStyle] = useState<CSSProperties>({ visibility: "hidden" });

  const computePosition = () => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const popupWidth = Math.min(maxWidth, Math.min(320, vw - 32)); // Ensure it fits on mobile
    const popupHeight = Math.min(280, vh - 100); // Adapt to viewport height

    let top = rect.top - popupHeight - 8;
    let left = rect.left + rect.width / 2 - popupWidth / 2;

    if (top < 8) {
      top = rect.bottom + 8;
    }

    if (left < 8) left = 8;
    if (left + popupWidth > vw - 8) left = vw - popupWidth - 8;

    if (buttonOffset?.x) left += buttonOffset.x;
    if (buttonOffset?.y) top += buttonOffset.y;

    setPopupStyle({
      position: "fixed",
      top: Math.round(top),
      left: Math.round(left),
      width: popupWidth,
      maxHeight: popupHeight,
      zIndex: 999999,
      visibility: "visible",
    });
  };

  const insertEmoji = (emoji: string) => {
    const quill = quillRef?.current?.getEditor?.();
    if (!quill) {
      const altQuill = quillRef?.current;
      if (altQuill?.getEditor) {
        const q = altQuill.getEditor();
        const idx = q.getSelection(true)?.index ?? q.getLength();
        q.insertText(idx, emoji);
        q.setSelection(idx + emoji.length);
      }
      setOpen(false);
      return;
    }

    const index = quill.getSelection(true)?.index ?? quill.getLength();
    quill.insertText(index, emoji);
    quill.setSelection(index + emoji.length);
    setOpen(false);
  };

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (popupRef.current && popupRef.current.contains(target)) return;
      if (buttonRef.current && buttonRef.current.contains(target)) return;
      setOpen(false);
    }
    function onScrollOrResize() {
      if (open) computePosition();
    }

    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPopupStyle(prev => ({ ...prev, visibility: "hidden" }));
      return;
    }
    computePosition();

    const t = setTimeout(() => computePosition(), 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const portal = typeof window !== "undefined" ? document.body : null;

  const popup = open ? ReactDOM.createPortal(
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="false"
      style={{
        ...popupStyle,
        background: "var(--emoji-bg, #fff)",
        borderRadius: responsiveSize(8, 12),
        boxShadow: `0 ${responsiveSize(5, 10)} ${responsiveSize(15, 30)} rgba(0,0,0,0.15)`,
        padding: responsiveSize(6, 8),
        boxSizing: "border-box" as const,
        overflow: "hidden",
        color: "var(--emoji-text, #111)",
        minWidth: "280px", // Ensure minimum usable size on mobile
      }}
    >
      {/* categories */}
      <div style={{ 
        display: "flex", 
        gap: responsiveSize(4, 6), 
        paddingBottom: responsiveSize(4, 6), 
        borderBottom: `${responsiveSize(1, 1)} solid rgba(0,0,0,0.06)` 
      }}>
        {Object.keys(emojiCategories).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            style={{
              border: "none",
              background: activeCat === cat ? "rgba(0,0,0,0.06)" : "transparent",
              padding: `${responsiveSize(4, 6)} ${responsiveSize(6, 8)}`,
              borderRadius: responsiveSize(6, 8),
              cursor: "pointer",
              fontSize: responsiveSize(14, 18),
              minWidth: responsiveSize(32, 40), // Ensure tap targets are large enough on mobile
              minHeight: responsiveSize(32, 40),
            }}
            aria-pressed={activeCat === cat}
            title={`Category ${cat}`}
          >
            {cat}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setOpen(false)}
          aria-label="Close emoji"
          style={{ 
            border: "none", 
            background: "transparent", 
            cursor: "pointer", 
            padding: responsiveSize(4, 6),
            minWidth: responsiveSize(32, 40),
            minHeight: responsiveSize(32, 40),
          }}
        >
          ✕
        </button>
      </div>

      {/* emoji grid - REMOVED THE MARGIN TOP */}
      <div style={{ 
        overflowY: "auto", 
        maxHeight: popupStyle.maxHeight ?? 280, 
        paddingRight: responsiveSize(4, 6),
        // REMOVED: marginTop: responsiveSize(6, 8) - This was causing the space
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))", // Responsive grid
          gap: responsiveSize(4, 6),
          alignItems: "center",
        }}>
          {emojiCategories[activeCat].map(e => (
            <button
              key={e}
              onClick={() => insertEmoji(e)}
              style={{
                fontSize: responsiveSize(16, 20),
                padding: responsiveSize(4, 6),
                borderRadius: responsiveSize(6, 8),
                border: "none",
                background: "transparent",
                cursor: "pointer",
                minWidth: responsiveSize(36, 44),
                minHeight: responsiveSize(36, 44),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title={e}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>,
    portal
  ) : null;

  return (
    <>
      <div style={{ position: "relative" }}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(prev => !prev)}
          aria-label="Open emoji picker"
          style={{
            position: "absolute",
            right: responsiveSize(4, 8), // Better responsive spacing
            bottom: responsiveSize(4, 8), // Better responsive spacing
            zIndex: 20,
            borderRadius: "50%",
            background: "var(--emoji-btn-bg, #fff)",
            border: "none",
            boxShadow: `0 ${responsiveSize(4, 6)} ${responsiveSize(10, 14)} rgba(0,0,0,0.12)`,
            width: responsiveSize(32, 40), // Responsive button size
            height: responsiveSize(32, 40), // Responsive button size
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: responsiveSize(16, 20), // Responsive emoji size
          }}
        >
          😀
        </button>
      </div>

      {popup}
    </>
  );
}