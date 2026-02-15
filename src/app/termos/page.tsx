import Background from "@/components/Background";

export const metadata = {
    title: "Termos de Uso e Política de Privacidade | Tabacaria Skybox",
    description: "Termos de uso, política de privacidade e condições de compra da Tabacaria Skybox.",
};

export default function TermosPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 relative">
            <Background />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-12 uppercase tracking-tighter border-b border-white/10 pb-8">
                        Termos de <span className="text-primary">Uso</span>
                    </h1>

                    <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                        <section className="mb-12 border-l-2 border-primary/20 pl-6">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="text-primary">01.</span> Aceitação
                            </h2>
                            <p>
                                Ao acessar a Skybox Tabacaria, você concorda com estes termos de serviço, todas as leis e regulamentos aplicáveis,
                                e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. O acesso é estritamente proibido para menores de 18 anos.
                            </p>
                        </section>

                        <section className="mb-12 border-l-2 border-primary/20 pl-6">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="text-primary">02.</span> Produtos Restritos
                            </h2>
                            <p>
                                Todos os produtos comercializados neste site são destinados exclusivamente a adultos. É crime vender, fornecer, servir, ministrar ou entregar, ainda que gratuitamente, de qualquer forma, a criança ou a adolescente, produtos cujos componentes possam causar dependência física ou psíquica.
                            </p>
                        </section>

                        <section className="mb-12 border-l-2 border-primary/20 pl-6">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="text-primary">03.</span> Licença de Uso
                            </h2>
                            <p>
                                É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Skybox,
                                apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título.
                            </p>
                        </section>

                        <section className="mb-12 border-l-2 border-primary/20 pl-6">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="text-primary">04.</span> Isenção de Responsabilidade
                            </h2>
                            <p>
                                Os materiais no site da Skybox são fornecidos &quot;como estão&quot;. A Skybox não oferece garantias, expressas ou implícitas,
                                e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições
                                de comercialização, adequação a um fim específico ou não violação de propriedade intelectual.
                            </p>
                        </section>

                        <section className="mb-12 border-l-2 border-primary/20 pl-6">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="text-primary">05.</span> Política de Privacidade
                            </h2>
                            <p>
                                Respeitamos sua privacidade. Seus dados pessoais serão utilizados apenas para processar seus pedidos e melhorar sua experiência no site.
                                Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing não autorizado.
                            </p>
                        </section>

                        <section className="mb-12 border-l-2 border-primary/20 pl-6">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="text-primary">06.</span> Limitações
                            </h2>
                            <p>
                                Em nenhum caso a Skybox ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação,
                                danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade
                                de usar os materiais em Skybox.
                            </p>
                        </section>
                    </div>

                    <div className="pt-8 border-t border-white/10 mt-12 text-sm text-neutral-500 font-mono">
                        <p>SKYBOX TABACARIA: {new Date().getFullYear()}.1.0 // SESSÕES DE OUTRO MUNDO</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
