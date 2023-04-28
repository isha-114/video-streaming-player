import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Video } from '../../../app/video.model';
import { UploadFileService } from '../../Services/upload-file.service';

@Component({
  selector: 'app-video-uploader',
  templateUrl: './video-uploader.component.html',
  styleUrls: ['./video-uploader.component.scss']
})
export class VideoUploaderComponent {
  video = [ {
    "title":"string",
    "description":"",
  }]
  videoData: Video[] = this.video;
  fileName = '';
  uploadProgress?: number;
  uploadSub?: Subscription;
  submitted = false;
  errorMessage: string = "";
  url: any;
  format = 'video';
  file: File | undefined;
  constructor(private http: HttpClient, private uploadService: UploadFileService) {}

  uploadFile = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
  });
  onFileSelected(event: any) {
    this.file = event.target.files[0];

    if (this.file) {
      this.fileName = this.file.name;
      console.log(event.target.files);
      const formData = new FormData();
      formData.append('thumbnail', this.file);
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
      }
      const video = document.createElement('video')

  video.onloadedmetadata = evt => {
    // Revoke when you don't need the url any more to release any reference
    URL.revokeObjectURL(this.url)
    console.log(video.videoWidth, video.videoHeight)
  }
  video.src = this.url
  video.load() // fetches metadata
      // const upload$ = this.http.post('/api/thumbnail-upload', formData, {
      //   reportProgress: true,
      //   observe: 'events',
      // });

      // this.uploadSub = upload$.subscribe((event: any) => {
      //   if (event.type == HttpEventType.UploadProgress) {
      //     this.uploadProgress = Math.round(100 * (event.loaded / event.total));
      //   }
      // });
    }
  }

  upload() {

  }
  get f(): { [key: string]: AbstractControl } {
    return this.uploadFile.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.file) {
      if((this.file.type.match('video.*')))
      {
        this.uploadService.uploadfile(this.file).subscribe(resp => {
          alert("Uploaded")
        })
      }
      else
      {
        this.errorMessage = "Please upload a video file";
      }
    }
    if (this.uploadFile.invalid) {
      return;
    }
    console.log(JSON.stringify(this.uploadFile.value, null, 2));
  }

  cancelUpload() {
    this.uploadSub?.unsubscribe();
  }
}
