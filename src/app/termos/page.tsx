import { createClient } from "@/utils/supabase/server";

export const metadata = {
    title: "Termos de Uso e Política de Privacidade | Tabacaria Skybox",
    description: "Termos de uso, política de privacidade e condições de compra da Tabacaria Skybox.",
};

export default async function TermosPage() {
    const supabase = await createClient();
    const { data: config } = await supabase.from("store_settings").select("terms_content").single();

    const hasCustomContent = config?.terms_content && config.terms_content.trim().length > 0;

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-200 py-20 px-6">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl font-display font-bold text-white mb-8 border-b border-white/10 pb-4">
                    Termos de Uso e Política de Privacidade
                </h1>

                <div className="space-y-8 text-neutral-400">
                    {hasCustomContent ? (
                        <div
                            className="prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: config.terms_content }}
                        />
                    ) : (
                        <>
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
                                <p>
                                    Ao acessar e usar este site, você declara ter conhecimento e concordar com os estes termos.
                                    <strong> O acesso é estritamente proibido para menores de 18 anos.</strong> A Tabacaria Skybox se reserva o direito de solicitar comprovação de idade a qualquer momento.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">2. Produtos Restritos</h2>
                                <p>
                                    Todos os produtos comercializados neste site são destinados exclusivamente a adultos. É crime vender, fornecer, servir, ministrar ou entregar, ainda que gratuitamente, de qualquer forma, a criança ou a adolescente, produtos cujos componentes possam causar dependência física ou psíquica.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">3. Política de Privacidade</h2>
                                <p>
                                    Respeitamos sua privacidade. Seus dados pessoais serão utilizados apenas para processar seus pedidos e melhorar sua experiência no site. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing não autorizado.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">4. Política de Entrega e Devolução</h2>
                                <p>
                                    Prazos de entrega são estimados e podem variar. Em caso de arrependimento, o consumidor tem o prazo de 7 dias a contar do recebimento do produto para solicitar a devolução, conforme o Código de Defesa do Consumidor, desde que o produto esteja lacrado e sem uso.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">5. Alterações</h2>
                                <p>
                                    A Tabacaria Skybox reserva-se o direito de alterar estes termos a qualquer momento, sem aviso prévio. Recomendamos a revisão periódica desta página.
                                </p>
                            </section>
                        </>
                    )}

                    <div className="pt-8 border-t border-white/10 mt-12 text-sm text-neutral-500">
                        <p>Última atualização: {new Date().getFullYear()}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
