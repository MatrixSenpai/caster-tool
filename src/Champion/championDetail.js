import { useLoaderData, Link } from 'react-router-dom';
import { invoke } from '@tauri-apps/api';
import { resourceDir, join } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export async function championDetailLoader({ params }) {
    let { championId } = params;
    return invoke('load_champion_by_id', { id: championId }).then(async champion => {
        let championImageName = champion.image.full;
        let dataDir = await resourceDir();
        let resourcePath = await join(dataDir, `ddragon/img/champion/${championImageName}`);
        champion.imagePath = convertFileSrc(resourcePath);

        let championPassivePath = await join(dataDir, `ddragon/img/passive/${champion.passive.image.full}`);
        champion.passive.imagePath = convertFileSrc(championPassivePath);

        champion.spellsConverted = await Promise.all(champion.spells.map(async spell => {
            let resourcePath = await join(dataDir, `ddragon/img/spell/${spell.image.full}`);
            spell.imagePath = convertFileSrc(resourcePath);
            return spell;
        }))

        return champion;
    });
}

export default function ChampionDetail() {
    const champion = useLoaderData();

    return (
        <div className='container mt-2'>
            <div className='row'>
                <div className='col'>
                    <Link to='..' className='btn'>
                        <FontAwesomeIcon icon='far fa-arrow-left' className='me-2' />
                        Return to Champion List
                    </Link>
                </div>
            </div>

            <div className='row'>
                <div className='card'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-1'>
                                <img src={champion.imagePath} alt='Champion Image' className='img-fluid' />
                            </div>
                            <div className='col'>
                                <h1 className='card-title'>{champion.name}</h1>
                                <h4 className='card-subtitle'>{champion.title}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='row row-cols-1 row-cols-md-5 mt-3 justify-content-center'>
                <ChampionAbilityCard ability={champion.passive} key={champion.passive.name} />
                {champion.spells.map(ability => <ChampionAbilityCard ability={ability} key={ability.id} />)}
            </div>
        </div>
    )
}

function ChampionAbilityCard(params) {
    const { ability } = params;
    const cleanAbilityText = ability.description.replace(/<\/?[^>]+(>|$)/g, "");

    return (
        <div className='col'>
            <div className='card h-100'>
                <img src={ability.imagePath} alt={`Ability ${ability.id}`} className='card-img-top img-fluid' />
                <div className='card-body'>
                    <h5 className='card-title'>{ability.name}</h5>
                    <p className='card-text'>{cleanAbilityText}</p>
                </div>
            </div>
        </div>
    )
}