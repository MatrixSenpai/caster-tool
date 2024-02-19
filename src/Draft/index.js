import { Outlet, useLoaderData } from 'react-router-dom';

import ErrorPage from 'Error';
import { join, resourceDir } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { invoke } from '@tauri-apps/api';

const DraftRoutes = {
    path: '/draft/*',
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
        {
            index: true,
            element: <Draft />,
            loader: draftLoader,
        }
    ]
};
export default DraftRoutes;

async function draftLoader() {
    let dataDir = await resourceDir();
    let resourcePath = await join(dataDir, 'ddragon/img/splash/Syndra_0.jpg');
    let tempImage = convertFileSrc(resourcePath);

    return invoke('load_champions').then(async champions => {
        let championsResolved = await Promise.all(champions.map(async champion => {
            let championImageName = champion.image.full;
            let dataDir = await resourceDir();
            let resourcePath = await join(dataDir, `ddragon/img/champion/${championImageName}`);
            champion.imagePath = convertFileSrc(resourcePath);
            return champion;
        }))
            .then(champions => champions.sort((ca, cb) => ca.id > cb.id));

        return { tempImage, champions: championsResolved };
    });
}

function Draft() {
    let { tempImage, champions } = useLoaderData();

    let tempItems = [
        { image: tempImage, title: "Asdf" },
        { image: tempImage, title: "Asdf" },
        { image: tempImage, title: "Asdf" },
        { image: tempImage, title: "Asdf" },
        { image: tempImage, title: "Asdf" },
    ]

    return (
        <div className='container-fluid mt-2 vh-100'>
            <div className='row'>
                <p>Hello</p>
            </div>
            <div className='row' style={{height: "85%"}}>
                <DraftImageRow items={tempItems} />
                <DraftPickContainer champions={champions} />
                <DraftImageRow items={tempItems} />
            </div>
            <div className='row'>
                <p>Hello</p>
            </div>
        </div>
    )
}

function DraftPickContainer(params) {
    const { champions } = params;

    return (
        <div className='col-8 overflow-y-scroll h-100'>
            <div className='row row-cols-auto h-100 d-flex justify-content-center'>
                {champions.map(champion => (
                    <div className='col my-1 d-flex justify-content-center' key={champion.id}>
                        <img className='img-fluid img-thumbnail' src={champion.imagePath} />
                    </div>
                ))}
            </div>
        </div>
    )
}

function DraftImageRow(params) {
    const { items } = params;

    return (
        <div className='col-2 flex-column d-flex h-100'>
            {items.map((c, i) => <DraftImage image={c.image} title={c.title} key={i} />)}
        </div>
    )
}

function DraftImage(params) {
    const { image, title } = params;

    return (
        <div className='card text-bg-dark mb-1'>
            <img className='card-img img-fluid' src={image} />
            <div className='card-img-overlay'>
                <p className='card-text'>{title}</p>
            </div>
        </div>
    )
}