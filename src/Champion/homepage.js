import { useRef, useState } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { invoke } from '@tauri-apps/api';
import { resourceDir, join } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import Fuse from 'fuse.js';

export async function championHomepageLoader() {
    return invoke('load_champions').then(async champions => {
        return await Promise.all(champions.map(async champion => {
            let championImageName = champion.image.full;
            let dataDir = await resourceDir();
            let resourcePath = await join(dataDir, `ddragon/img/champion/${championImageName}`);
            champion.imagePath = convertFileSrc(resourcePath);
            return champion;
        }));
    });
}

export default function ChampionList() {
    const champions = useLoaderData().sort((ca, cb) => ca.name > cb.name);
    const [filteredChampions, setFilteredChampions] = useState(champions);
    const searchInputId = useRef(null);
    const fuse = new Fuse(champions, {
        threshold: 0.3,
        keys: ['name']
    });

    const handleSearchUpdate = () => {
        let value = searchInputId.current.value;
        if(value === "" || value === null || value === undefined)
            return setFilteredChampions(champions);

        const filtered = fuse.search(value).map(i => i.item);
        setFilteredChampions(filtered);
    }

    return (
        <div className='container mt-2'>
            <div className='row'>
                <div className='col'>
                    <div className='input-group mb-3'>
                        <input
                            type='text'
                            ref={searchInputId}
                            className='form-control'
                            placeholder='Search champion...'
                            onChange={handleSearchUpdate}
                        />
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col'>
                    <div className='list-group'>
                        {filteredChampions.map(c => <ChampionItem champion={c} key={c.id} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ChampionItem(params) {
    const { champion } = params;

    return (
        <Link to={`/champion/${champion.id}`} className='list-group-item list-group-item-action'>
            <div className='d-flex w-100 justify-content-start'>
                <img src={champion.imagePath} alt='Champion Image' width='50' />
                <p className='align-middle ms-3'>{champion.name} - {champion.title}</p>
            </div>
        </Link>
    )
}