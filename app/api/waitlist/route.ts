import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY!);

// Validation simple de l'email avec regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * API Route pour gérer les inscriptions à la waitlist
 * POST /api/waitlist
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Récupérer et valider le body
    const body = await request.json();
    const { email } = body;

    // Validation de l'email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // 2. Insérer l'email dans Supabase
    const { data, error: insertError } = await supabase
      .from("waitlist")
      .insert([
        {
          email: trimmedEmail,
          source: "landing_hero",
        },
      ])
      .select()
      .single();

    // 3. Gérer le cas où l'email existe déjà (conflit unique)
    if (insertError) {
      // Code d'erreur Postgres pour violation de contrainte unique
      if (insertError.code === "23505") {
        // L'email existe déjà, mais on considère ça comme un succès
        return NextResponse.json(
          {
            success: true,
            alreadyRegistered: true,
            message: "This email is already on the waitlist",
          },
          { status: 200 }
        );
      }

      // Autre erreur Supabase
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { success: false, error: "Database error. Please try again." },
        { status: 500 }
      );
    }

    // 4. Envoyer l'email de bienvenue via Resend
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Rhetix <hello@rhetix.app>",
        to: trimmedEmail,
        subject: "Welcome to Rhetix 👋",
        html: `
        
         <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
  <h1 style="font-size: 24px; font-weight: 600; color: #000; margin-bottom: 20px;">
    Hey,
  </h1>

  <p style="line-height: 1.6; color: #333; margin-bottom: 16px;">
    Thanks for joining the Rhetix early access.
  </p>

  <p style="line-height: 1.6; color: #333; margin-bottom: 16px;">
    You know that moment when you know exactly what you want to say, but the words just don't come out right? It's frustrating. And that's exactly what Rhetix is here to solve.
  </p>

  <p style="line-height: 1.6; color: #333; margin-bottom: 16px;">
    Before we launch, I have one simple question for you:
  </p>

  <p style="line-height: 1.6; color: #333; margin-bottom: 20px; font-weight: 600; font-size: 16px;">
    What makes communication hard for you right now?
  </p>

  <p style="line-height: 1.6; color: #333; margin-bottom: 20px;">
    Reply directly to this email. I read everything personally and your feedback will directly shape the product.
  </p>

  <p style="line-height: 1.6; color: #333; margin-top: 32px;">
    Talk soon,<br>
    <strong>MK</strong><br>
    <span style="color: #666;">Founder of Rhetix</span>
  </p>

  <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; color: #999; font-size: 12px; line-height: 1.5;">
    P.S. If this landed in spam, mark it as "Not Spam" so you don't miss future updates.
  </p>

  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; text-align: center;">
    <p>Rhetix — AI-powered communication assistant</p>
    <p>You received this email because you signed up for early access at rhetix.com</p>
  </div>
</div>


        `,
        text: `Hey,

Thanks for joining the Rhetix early access list.

If you're here, it's probably because you have ideas… but sometimes the words don't come out the way you want.

You're not alone — and that's exactly what Rhetix is built for.

Before we launch, I'd love to know one thing:
What's your biggest challenge when it comes to speaking or writing better?

Just reply to this email — I read everything.

Talk soon,
MK
Founder, Rhetix`,
      });
    } catch (emailError) {
      // Log l'erreur mais ne pas faire échouer la requête
      // L'utilisateur est bien inscrit même si l'email n'est pas parti
      console.error("Resend email error:", emailError);
    }

    // 5. Retourner le succès
    return NextResponse.json(
      { success: true, message: "Successfully joined the waitlist!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in /api/waitlist:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Interdire les autres méthodes HTTP
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
