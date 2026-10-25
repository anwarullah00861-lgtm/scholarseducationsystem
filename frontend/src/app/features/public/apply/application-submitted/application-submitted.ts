import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AppIcon } from '../../../../shared/components/app-icon/app-icon';
import { PageHero } from '../../../../shared/components/page-hero/page-hero';

@Component({
  selector: 'app-application-submitted',
  imports: [RouterLink, AppIcon, PageHero],
  templateUrl: './application-submitted.html',
  styleUrl: './application-submitted.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationSubmitted {
  private readonly route = inject(ActivatedRoute);

  protected readonly referenceId = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('id'))),
    { initialValue: null },
  );
}
