import { toastController } from "@ionic/vue";

export async function featureNotAvailable() {
  const toast = await toastController.create({
    message: 'Det här är inte tillgängligt i denna testversion.',
    duration: 2000,
    position: 'bottom',
  });

  await toast.present();
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
