import {exportImages} from "pdf-export-images";
import path from "path";
import fs from "fs";



export async function destroyPreviousRequestedImg(req, res) {
    let dirScan = fs.readdirSync(`${path.resolve('public/uploaded')}`)
    if (dirScan) {
        for (const image in dirScan) {
            if (Object.hasOwnProperty.call(dirScan, image)) {
                let element = dirScan[image]
                let fileExtension = element.split('.').pop()
                if (fileExtension === 'png') {
                    if (fs.existsSync(`${path.resolve('public/uploaded')}/${element}`)) {
                        await fs.unlinkSync(path.resolve(`public/uploaded/${element}`))
                    }
                }


            }
        }
    }
    res.status(200).json({ message: "Public directory has been successfully rested." })
}

export function destroyView(req, res) {
    res.render('destroy')
}






