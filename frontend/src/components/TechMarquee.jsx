import Marquee from "react-fast-marquee";
import {
  SiVercel,
  SiCloudflare,
  SiDigitalocean,
  SiGooglecloud,
  SiReact,
  SiPython,
  SiDocker,
  SiKubernetes,
  SiTypescript,
  SiPostgresql,
  SiTensorflow,
  SiNodedotjs,
  SiGo,
  SiTerraform,
} from "react-icons/si";

const icons = [
  { Icon: SiGooglecloud, name: "Google Cloud" },
  { Icon: SiCloudflare, name: "Cloudflare" },
  { Icon: SiDigitalocean, name: "DigitalOcean" },
  { Icon: SiVercel, name: "Vercel" },
  { Icon: SiKubernetes, name: "Kubernetes" },
  { Icon: SiDocker, name: "Docker" },
  { Icon: SiTerraform, name: "Terraform" },
  { Icon: SiReact, name: "React" },
  { Icon: SiTypescript, name: "TypeScript" },
  { Icon: SiNodedotjs, name: "Node.js" },
  { Icon: SiPython, name: "Python" },
  { Icon: SiGo, name: "Go" },
  { Icon: SiTensorflow, name: "TensorFlow" },
  { Icon: SiPostgresql, name: "PostgreSQL" },
];

export default function TechMarquee() {
  return (
    <div className="marquee-mask py-4" data-testid="tech-marquee">
      <Marquee speed={40} gradient={false} pauseOnHover>
        {icons.map(({ Icon, name }, i) => (
          <div
            key={i}
            className="mx-10 flex items-center gap-3 text-zinc-500 hover:text-white transition-colors duration-300"
            title={name}
          >
            <Icon className="h-8 w-8" />
            <span className="font-mono text-sm tracking-tight hidden sm:inline">{name}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
